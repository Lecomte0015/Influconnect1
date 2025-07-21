import React, { useEffect, useState } from 'react';
import WithdrawModal from '../../components/WithdrawModal'; 
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Download,
  CreditCard,
  Plus,
} from 'lucide-react';

const UserWallet = () => {
  const [balance, setBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');

  const loadWallet = async () => {
    try {
      const res = await fetch('http://localhost:3001/wallet', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Erreur lors du chargement du wallet');
      const data = await res.json();
      setBalance(data.balance);
      setPendingBalance(data.pending);
    } catch (error) {
      console.error(error);
      
    }
  };

  const loadTransactions = async () => {
    try {
      const res = await fetch('http://localhost:3001/wallet/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Erreur lors du chargement des transactions');
      const data = await res.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error(error);
      alert('Erreur lors du chargement des transactions');
    }
  };

  const handleWithdraw = async (amount) => {
    try {
      const res = await fetch('http://localhost:3001/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Erreur lors de la demande');
        return;
      }
      alert('Demande de retrait envoyée');
      await loadWallet();
      await loadTransactions();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la demande de retrait');
    }
  };

  useEffect(() => {
    loadWallet();
    loadTransactions();
  }, []);

  const availableBalance = balance - pendingBalance;

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h1>Mon Portefeuille</h1>
        <button className="withdraw-button" onClick={() => setShowModal(true)}>
          <Banknote size={18} /> Retirer des fonds
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

      {/* ✅ Bloc Méthodes de paiement */}
      <div className="payment-methods">
        <div className="payment-methods-header">
          <h2>
            <CreditCard size={20} className="mr-2" />
            Méthodes de paiement
          </h2>
          <button className="add-method-button">
            <Plus size={16} /> Ajouter une méthode de paiement
          </button>
        </div>
        <div className="payment-methods-placeholder">
          <p>Aucune méthode de paiement enregistrée.</p>
        </div>
      </div>

      {/* ✅ Transactions */}
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
              transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.date).toLocaleDateString('fr-FR')}</td>
                  <td>{tx.description}</td>
                  <td className={tx.amount > 0 ? 'text-green' : 'text-red'}>
                    {tx.amount > 0 ? '+' : ''}
                    {tx.amount.toFixed(2)}€
                  </td>
                  <td>
                    <span className={`badge ${tx.status === 'done' ? 'success' : 'warning'}`}>
                      {tx.status === 'done' ? 'Complété' : 'En attente'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Aucune transaction</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <WithdrawModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onWithdraw={handleWithdraw}
      />
    </div>
  );
};

export default UserWallet;
