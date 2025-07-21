import React, { useState } from 'react';


const WithdrawModal = ({ isOpen, onClose, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Virement bancaire');
  const [iban, setIban] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [reason, setReason] = useState('');
  const balance = 0.0; // Valeur fictive pour le moment

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || isNaN(parsedAmount)) return;

    const payload = {
      amount: parsedAmount,
      method,
      ...(method === 'Virement bancaire' && { iban }),
      ...(method === 'Paypal' && { paypalEmail }),
      reason,
    };

    onWithdraw(payload);
    setAmount('');
    setMethod('Virement bancaire');
    setIban('');
    setPaypalEmail('');
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 className="modal-title">Demande de retrait</h3>

        <div className="balance-section">
          <p><strong>Solde disponible :</strong> {balance.toFixed(2)} €</p>
        </div>

        <form onSubmit={handleSubmit}>

        <div className="form-group">
            <label htmlFor="amount">Montant à retirer (€)</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="Saisir le montant"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
              required
            />
          </div>
          

          <div className="form-group">
            <label htmlFor="method">Méthode de retrait</label>
            <select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="input-field"
            >
              <option value="Virement bancaire">Virement Bancaire</option>
              <option value="Paypal">Paypal</option>
            </select>
          </div>

          {method === 'Virement bancaire' && (
            <div className="form-group">
              <label htmlFor="iban">IBAN du compte bancaire</label>
              <input
                id="iban"
                type="text"
                placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="input-field"
                required
              />
            </div>
          )}

          {method === 'Paypal' && (
            <div className="form-group">
              <label htmlFor="paypalEmail">Adresse email Paypal</label>
              <input
                id="paypalEmail"
                type="email"
                placeholder="ex: user@paypal.com"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="reason">Motif du retrait (facultatif)</label>
            <textarea
              id="reason"
              placeholder="Ex: besoin personnel, investissement..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field"
              rows="2"
            />
          </div>

          <div className="info-hints">
            <p>⏱ Traitement sous 2-3 jours ouvrables</p>
            <p>💸 Des frais de traitement de 2% peuvent s’appliquer</p>
            <p>📌 Montant minimum de retrait : 10€</p>
            <p>📧 Confirmation envoyée par email</p>
          </div>

          <div className="button-group">
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary">Demander le retrait</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
