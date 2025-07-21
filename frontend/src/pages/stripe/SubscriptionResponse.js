import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SubscriptionResponse = () => {
  const [params] = useSearchParams();
  const status = params.get('success') === 'true' ? 'completed'
               : params.get('cancelled') === 'true' ? 'failed'
               : 'pending';

  const sessionId = params.get('session_id');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackSubscription = async () => {
      try {
        const res = await axios.post('http://localhost:3001/stripe/track-subscription', {
          status,
          sessionId,
        });

        if (res.data.success) {
          setMessage(
            status === 'completed'
              ? '✅ Abonnement confirmé avec succès !'
              : status === 'failed'
              ? '❌ Paiement annulé ou échoué.'
              : '🕓 En attente de confirmation.'
          );
        } else {
          setMessage('⚠️ Échec lors de l’enregistrement de la transaction.');
        }
      } catch (error) {
        console.error('Erreur frontend :', error);
        setMessage('⚠️ Une erreur est survenue.');
      } finally {
        setLoading(false);
      }
    };

    // On exécute la requête seulement si un status est présent
    if (status !== 'pending') {
      trackSubscription();
    } else {
      setLoading(false);
      setMessage('🔄 Statut non reconnu dans l’URL.');
    }
  }, [status, sessionId]);

  return (
    <div className="subscription-response" style={{ padding: '2rem', textAlign: 'center' }}>
      {loading ? <p>⏳ Chargement des informations...</p> : <h2>{message}</h2>}
    </div>
  );
};

export default SubscriptionResponse;
