import React from 'react';
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Banknote,
  Download,
} from 'lucide-react';

const UserWallet = ({
  balance = 0,
  pendingBalance = 0,
  paymentMethods = [],
  transactions = [],
}) => {
  const availableBalance = balance - pendingBalance;

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h1>Mon Portefeuille</h1>
        <button className="withdraw-button">
          <Banknote size={18} />
          Retirer des fonds
        </button>
      </div>

      <div className="wallet-cards">
        <div className="wallet-card">
          <div className="icon green-bg">
            <DollarSign size={24} color="#16a34a" />
          </div>
          <div>
            <p className="label">Solde total</p>
            <p className="amount">{balance.toFixed(2)}€</p>
          </div>
        </div>

        <div className="wallet-card">
          <div className="icon yellow-bg">
            <ArrowUpRight size={24} color="#ca8a04" />
          </div>
          <div>
            <p className="label">En attente</p>
            <p className="amount">{pendingBalance.toFixed(2)}€</p>
          </div>
        </div>

        <div className="wallet-card">
          <div className="icon blue-bg">
            <ArrowDownRight size={24} color="#2563eb" />
          </div>
          <div>
            <p className="label">Disponible</p>
            <p className="amount">{availableBalance.toFixed(2)}€</p>
          </div>
        </div>
      </div>

      <div className="payment-methods">
        <div className="methods-header">
          <h2>Méthodes de paiement</h2>
          <button className="add-button">+ Ajouter</button>
        </div>

        <div className="method-list">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method, index) => (
              <div className="method-item" key={index}>
                <div className="method-info">
                  {method.type === 'card' ? (
                    <CreditCard size={24} color="#9ca3af" />
                  ) : (
                    <Banknote size={24} color="#9ca3af" />
                  )}
                  <div>
                    <p className="method-name">{method.name}</p>
                    <p className="method-detail">{method.details}</p>
                  </div>
                </div>
                {method.primary && <span className="badge primary">Principal</span>}
              </div>
            ))
          ) : (
            <p>Aucune méthode enregistrée</p>
          )}
        </div>
      </div>

      <div className="transactions">
        <div className="transactions-header">
          <h2>Transactions récentes</h2>
          <button className="export-button">
            <Download size={18} /> Exporter
          </button>
        </div>

        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Montant</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleDateString('fr-FR')}</td>
                  <td>{transaction.description}</td>
                  <td className={transaction.amount > 0 ? 'text-green' : 'text-red'}>
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.amount.toFixed(2)}€
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        transaction.status === 'completed'
                          ? 'success'
                          : transaction.status === 'pending'
                          ? 'warning'
                          : 'error'
                      }`}
                    >
                      {transaction.status === 'completed'
                        ? 'Complété'
                        : transaction.status === 'pending'
                        ? 'En attente'
                        : 'Échoué'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Aucune transaction disponible</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserWallet;
