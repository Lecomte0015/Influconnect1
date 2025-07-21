

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async ({ priceId, email, userId }) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: email,
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    success_url: `http://localhost:3000/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/subscription?cancelled=true`,

    metadata: {
      user_id: userId,
    },
  });

  return session;
};

