const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const db = require('../db');

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(' Signature Stripe invalide :', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
    
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
        const charge = paymentIntent.charges.data[0];
        const card = charge.payment_method_details.card;
        const userId = session.metadata?.user_id;
        const customerId = session.customer;
        const stripeCustomerId = session.customer;
        const session = event.data.object;
        if (!userId) {
          console.warn('⚠️ Aucun user_id fourni dans metadata');
          break;
        }
    
        //  Enregistre le customer Stripe dans users
        await db.promise().execute(
          'UPDATE users SET stripe_customer_id = ? WHERE id = ?',
          [stripeCustomerId, userId]

        );
        console.log(`✅ customer_id ${customerId} enregistré pour user ${userId}`);

        //  Enregistre le paiement
        await db.promise().execute(
          `INSERT INTO payments (user_id, stripe_payment_intent, card_brand, last4, exp_month, exp_year, amount, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'paid', NOW())`,
          [
            userId,
            paymentIntent.id,
            card.brand,
            card.last4,
            card.exp_month,
            card.exp_year,
            paymentIntent.amount_received / 100
          ]
        );
    
        console.log(` Paiement enregistré et customer_id stocké pour user ${userId}`);
      } catch (err) {
        console.error(' Erreur traitement paiement Stripe :', err);
      }
    
      break;
    

   
  }
// répond toujours à Stripe pour éviter retries
  res.status(200).send(); 
};
