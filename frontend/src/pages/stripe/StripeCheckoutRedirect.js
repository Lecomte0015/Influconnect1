import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';

const StripeCheckoutRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const planId = searchParams.get('planId');

  useEffect(() => {
    const initStripeCheckout = async () => {
      if (!planId) {
        console.warn('⚠️ Aucun planId trouvé dans l’URL');
        navigate('/subscription?error=no-plan');
        return;
      }

      try {
        const res = await api.post('/stripe/create-checkout-session', {
          planId,
        });

        if (res.data?.url) {
          window.location.href = res.data.url;
        } else {
          console.warn('⚠️ L’URL Stripe est vide');
          navigate('/subscription?error=invalid-url');
        }
      } catch (err) {
        console.error(' Erreur Stripe checkout:', err);
        navigate('/subscription?error=checkout');
      }
    };

    initStripeCheckout();
  }, [planId, navigate]);

  return <p> Redirection vers Stripe en cours…</p>;
};

export default StripeCheckoutRedirect;
