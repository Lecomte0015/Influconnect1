const { createCheckoutSession } = require('../services/stripeService');
const db = require('../db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ✅ Création d'une session Stripe Checkout (abonnement)
exports.handleCreateCheckoutSession = async (req, res) => {
  try {
    const session = await createCheckoutSession(req.body);
    res.json({ url: session.url });
  } catch (err) {
    console.error('Erreur Stripe :', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Portail client Stripe (gérer son abonnement)
exports.redirectToCustomerPortal = async (req, res) => {
  const userId = req.user.id;

  try {
    console.log("Customer Portal demandé par :", req.user);

    const [rows] = await db.promise().execute(
      'SELECT stripe_customer_id FROM users WHERE id = ?',
      [userId]
    );

    const customerId = rows[0]?.stripe_customer_id;
    if (!customerId) {
      return res.status(400).json({ error: 'Client Stripe introuvable' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'http://localhost:3000/subscription',
    });

    res.json({ url: portalSession.url });
  } catch (err) {
    console.error('Erreur Customer Portal :', err);
    res.status(500).json({ error: 'Erreur serveur Stripe' });
  }
};

// ✅ Enregistrement d'une transaction + abonnement + facture après redirection Stripe
exports.handleTrackSubscription = async (req, res) => {
  const { status, sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subscriptionId = session.subscription;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);

    const charge = invoice.charge
      ? await stripe.charges.retrieve(invoice.charge)
      : {};

    const payment = {
      user_id: session.metadata?.user_id || null,
      amount: invoice.amount_paid / 100,
      method: 'stripe',
      payment_date: new Date(),
      transaction_id: charge?.id || subscriptionId,
      status: status === 'completed' ? 'completed' : 'failed',
      created_at: new Date(),
      invoice_url: invoice.hosted_invoice_url || '',
      card_brand: charge?.payment_method_details?.card?.brand || '',
      last4: charge?.payment_method_details?.card?.last4 || '',
      exp_month: charge?.payment_method_details?.card?.exp_month || null,
      exp_year: charge?.payment_method_details?.card?.exp_year || null,
    };

    await db.promise().execute(
      `INSERT INTO Payments (
        user_id, amount, method, payment_date, transaction_id, status, created_at,
        invoice_url, card_brand, last4, exp_month, exp_year
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payment.user_id,
        payment.amount,
        payment.method,
        payment.payment_date,
        payment.transaction_id,
        payment.status,
        payment.created_at,
        payment.invoice_url,
        payment.card_brand,
        payment.last4,
        payment.exp_month,
        payment.exp_year,
      ]
    );

    //  Ajout de l'abonnement dans ta base locale
    const priceId = subscription.items.data[0]?.price?.id;
    console.log("Stripe price ID reçu :", priceId);

    const [plans] = await db.promise().execute(
      'SELECT id, duration FROM subscription_plans WHERE stripe_price_id = ?',
      [priceId]
    );
    console.log("Plan trouvé dans la BDD :", plans[0]);

    if (!plans.length) {
      console.warn("⚠️ Aucun plan trouvé avec ce stripe_price_id. Abonnement non enregistré.");
      return res.status(400).json({ error: "Plan d’abonnement introuvable" });
    }

    const planId = plans[0].id;
    const durationRaw = plans[0]?.duration || 'monthly';
    const durationInMonths = durationRaw === 'yearly' ? 12 : 1;

    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + durationInMonths);

    await db.promise().execute(
      `INSERT INTO subscriptions (
        user_id, subscription_plan_id, start_date, expire_at, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        payment.user_id,
        planId,
        new Date(),
        expirationDate,
        'active',
        new Date()
      ]
    );

    console.log(" Abonnement inséré avec plan ID :", planId);

    //  Enregistrement de la facture dans la table invoices
    await db.promise().execute(`
      INSERT INTO invoices (
        user_id, service_id, amount, status, pdf_path, created_at, hosted_invoice_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        payment.user_id,
        planId, 
        payment.amount,
        'paid',
        invoice.hosted_invoice_url,
        new Date(),
        invoice.hosted_invoice_url
      ]
    );

    console.log(" Facture enregistrée pour user :", payment.user_id);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur Stripe Track Subscription :', error);
    res.status(500).json({ success: false });
  }
};
