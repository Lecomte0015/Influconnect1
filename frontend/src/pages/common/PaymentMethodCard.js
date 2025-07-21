import React from 'react';
import {
  CreditCard,
      
  Banknote        
} from 'lucide-react';

const PaymentMethodCard = ({ method }) => {
  if (!method) return <p>Aucun moyen de paiement trouvé.</p>;

  const { card_brand, last4, exp_month, exp_year } = method;

  const formatMonth = String(exp_month).padStart(2, '0');
  const formatYear = String(exp_year).slice(-2);

  const getIcon = () => {
    switch (card_brand?.toLowerCase()) {
      case 'visa':
        return <CreditCard size={40} strokeWidth={1.5} color="#1a73e8" />;
      case 'mastercard':
        return <CreditCard size={40} strokeWidth={1.5} color="#ea4335" />;
      default:
        return <Banknote size={40} strokeWidth={1.5} color="#999" />;
    }
  };

  return (
    <div className="payment-card">
      {getIcon()}

      <div className="card-info">
        <p className="card-brand">{card_brand ?? 'Carte inconnue'}</p>
        <p className="card-last4">**** **** **** {last4}</p>
        <p className="card-exp">Expire : {formatMonth}/{formatYear}</p>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
