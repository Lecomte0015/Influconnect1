
import React from 'react';
import axios from 'axios';

const plans = [
  { group: 'influenceur', billing: 'monthly', name: 'pro', price: '24€' },
  { group: 'influenceur', billing: 'monthly', name: 'elite', price: '59€' },
  { group: 'marque', billing: 'yearly', name: 'elite', price: '399€' },
 
];

function Plans() {
  const handleSubscribe = async (plan) => {
    try {
      const res = await axios.post('http://localhost:5000/api/stripe/create-checkout-session', {
        userType: plan.group,
        billingCycle: plan.billing,
        plan: plan.name,
        email: 'user@example.com', 
      });
      window.location.href = res.data.url; 
    } catch (err) {
      console.error('Erreur Stripe:', err.response?.data || err.message);
    }
  };

  return (
    <div className="grid gap-4">
      {plans.map((plan, index) => (
        <div key={index} className="border p-4 rounded">
          <h3 className="text-xl font-bold capitalize">{plan.name} - {plan.price}</h3>
          <p>{plan.group} / {plan.billing}</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => handleSubscribe(plan)}
          >
            S'abonner
          </button>
        </div>
      ))}
    </div>
  );
}

export default Plans;
