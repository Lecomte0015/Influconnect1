import React, { useState, useEffect } from 'react';
import {api} from '../../utils/api';
import PaymentMethodCard from './PaymentMethodCard';
import { useSearchParams } from 'react-router-dom';
import {
  CreditCard, CheckCircle, AlertCircle, Calendar,Check,
} from 'lucide-react';

const Subscription = () => {
  const [loading, setLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [nextPayment, setNextPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [searchParams] = useSearchParams();
  const [currentUser, setCurrentUser] = useState(null);
  const success = searchParams.get('success');
  const cancelled = searchParams.get('cancelled');

  const mapUserType = (rawType) => {
    if (rawType === 'influencer') return 'influenceur';
    if (rawType === 'business') return 'marque';
    return rawType;
  };
  const rawUser = JSON.parse(localStorage.getItem('users'));
  const user = {
     ...rawUser,
  _type: mapUserType(rawUser?._type),
};



  useEffect(() => {
    console.log(" Chargement brut une seule fois");
    if (plans.length > 0) return; 
 
    api.get('/api/subscription-plans')
      .then((res) => {
        localStorage.setItem("Plans",JSON.stringify(res.data));
        
        setPlans(res.data);
      })
      .catch((err) => {
        console.error(" Erreur API:", err);
      });
  },);
  

  
  
  
  const handlePlanChange = async (plan) => {
    if (selectedPlan?.id === plan.id) return;
    setLoading(true);
  
    try {
      // Plan gratuit = mise à jour directe
      if (plan.price === 0) {
        const res = await api.post('/api/subscriptions/free', {
          userId: user.id,
          planId: plan.id,
        });
  
        if (res.status === 200) {
          //  Re-fetch des données utilisateur
          const updatedUserRes = await api.get(`/api/users/${user.id}`);
          const updatedUser = updatedUserRes.data;
  
          //  Met à jour le localStorage
          localStorage.setItem("users", JSON.stringify(updatedUser));
  
          //  Met à jour le state si tu utilises setUser ou activeSubscription
          setSelectedPlan(plan);
          setShowPlanModal(false);
          alert('Abonnement gratuit activé');
        }
      } else {
        // Plan payant = Stripe checkout
        const res = await api.post('/stripe/create-checkout-session', {
          priceId: plan.stripe_price_id,
          email: user.email,
          userId: user.id,
        });
  
        if (res.data?.url) {
          window.location.href = res.data.url;
        } else {
          alert('Impossible de lancer Stripe.');
        }
      }
    } catch (err) {
      console.error('Erreur changement de plan :', err);
      alert('Erreur lors du changement de plan');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStripePortal = () => {
    api.get('/stripe/customer-portal')
      .then(res => {
        window.location.href = res.data.url;
      })
      .catch(err => {
        console.error(' Erreur portail Stripe:', err);
      });
  };

  useEffect(() => {
    if (!showPlanModal || !user || !user._type) {
      console.warn("user._type est manquant");
      return;
    }
  
    api.get('/api/subscription-plans')
      .then((res) => {
        const filtered = res.data.filter(plan => plan._type === user._type); 
        setPlans(filtered);
      })
      .catch((err) => {
        console.error("Erreur API :", err);
        setPlans([]);
      });
  }, [showPlanModal, user._type]);
  
  

  
  // Récupération des infos liées à l’abonnement
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    
  
    api.get('/api/subscriptions/active', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setActiveSubscription(res.data))
    
    .catch(() => setActiveSubscription(null));
  }, []);
  
  
  useEffect(() => {
    const token = localStorage.getItem('token');
   
    api.get('/api/subscriptions/next-payment', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setNextPayment(res.data))
    .catch(() => setNextPayment(null));
  }, []);
  
  
  useEffect(() => {
    api.get('/api/payments/latest')
      .then(res => setPaymentMethod(res.data))
      .catch(() => setPaymentMethod(null));
  }, []);
  
  useEffect(() => {
    api.get('/api/invoices')
      .then(res => setInvoices(res.data))
      .catch(err => {
        console.error(' Erreur invoices:', err);
        console.log('Headers envoyés :', err.config?.headers);
      });
  }, []);
  

 return (
  <>
        <div className="subscription-container">
          <h1 className="subscription-title">Mon Abonnement</h1>

          {success && <p className="success">Paiement effectué avec succès</p>}
          {cancelled && <p className="error">Paiement annulé</p>}
         


          {/* SECTION - ABONNEMENT ACTIF */}
          <div className="subscription-card">
            <div className="subscription-header">
              <div>
                <h2 className="subscription-plan-title">
                  Plan actuel : {activeSubscription?.name || 'Non défini'}
                </h2>
                <p className="subscription-description">Votre abonnement est actif</p>
              </div>
              <span className="status-badge">Actif</span>
            </div>

            {/* DETAILS ABONNEMENT */}
            <div className="subscription-grid">
              <div className="subscription-block">
                <div className="subscription-info">
                  <Calendar />
                  <strong>Période actuelle</strong>
                  <p>
                    du {activeSubscription?.start_date ? new Date(activeSubscription.start_date).toLocaleDateString() : '--'} 
                    au {activeSubscription?.end_date ? new Date(activeSubscription.end_date).toLocaleDateString() : '--'}
                  </p>
                </div>

                <div className="subscription-info">
                  <CreditCard />
                  <strong>Moyen de paiement</strong>
                  <PaymentMethodCard method={paymentMethod} />
                </div>
              </div>

              <div className="subscription-block">
                <div className="subscription-info">
                  <CheckCircle />
                  <strong>Renouvellement automatique</strong>
                  <p>Activé</p>
                </div>
                <div className="subscription-info">
                  <AlertCircle />
                  <strong>Prochain paiement</strong>
                  <p>
                    {nextPayment ? `${nextPayment.amount}€ le ${new Date(nextPayment.due_date).toLocaleDateString()}` : 'Aucun prévu'}
                  </p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="subscription-actions">
              <button onClick={() => setShowPlanModal(true)} className="btn-primary">
                Changer de plan
              </button>
            </div>
          </div>

          {/* MODALE CHANGEMENT DE PLAN */}
          {showPlanModal && (
          <>
            <div className="modal-backdrop">
              <div className="modal">
                <div className="modal-header">
                  <h2>Changer de plan</h2>
                  <button className="close-btn" onClick={() => setShowPlanModal(false)}>×</button>
                </div>

                <div className="modal-body">
                  {plans.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'orange' }}>
                      ⚠️ Aucun plan disponible pour le rôle "<strong>{user?._type || 'non défini'}</strong>"
                    </p>
                  ) : (
                    <div className="plans-carousel">
                      <div className="carousel-track">
                        {plans
                          .filter(plan => user?._type === plan._type)
                          .map(plan => (
                            <div
                              key={plan.id}
                              className={`plan-card1 ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
                            >
                              <h3>{plan.name}</h3>
                              <p className="plan-description">{plan.description}</p>
                              <p className="plan-price">
                                {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
                                {plan.price > 0 && (
                                  <span> par {plan.duration === 'monthly' ? 'mois' : 'an'}</span>
                                )}
                              </p>

                              <button
                                disabled={loading || selectedPlan?.id === plan.id}
                                className={`btn-choose ${selectedPlan?.id === plan.id ? 'disabled' : ''}`}
                                onClick={() => handlePlanChange(plan)}
                              >
                                {selectedPlan?.id === plan.id ? 'Plan actuel' : 'Choisir ce plan'}
                              </button>

                              {plan.features && (
                                <ul className="plan-features">
                                  {(Array.isArray(plan.features)
                                    ? plan.features
                                    : JSON.parse(plan.features)
                                  ).map((feature, index) => (
                                    <li key={index} className="feature-item">
                                      <span className="check-icon">
                                        <Check size={16} />
                                      </span>
                                      <span className="feature-text">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
          {/* HISTORIQUE DE FACTURATION */}
          <div className="subscription-card">
            <h2 className="subscription-plan-title">Historique de facturation</h2>
            <div className="table-container">
              <table className="billing-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Facture</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{new Date(invoice.created_at).toLocaleDateString()}</td>
                      <td>Abonnement</td>
                      <td>{invoice.amount} €</td>
                      <td>
                        <span className={invoice.status === 'paid' ? 'text-success' : 'text-danger'}>
                          {invoice.status}
                        </span>
                      </td>
                      <td>
                        <a href={invoice.pdf_path} target="_blank" rel="noopener noreferrer">
                          Télécharger
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
};

export default Subscription;
