import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Banknote,
  Download,
  Plus,
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react';

const BrandWallet = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const transactions = []; // Tu remplaceras par les données de ton backend

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    return transaction.type === selectedFilter;
  });

  return (
    <div className="wallet-page">
      <div className="wallet-container">

        {/* Header */}
        <div className="wallet-header">
          <div className="wallet-header-left">
            <button onClick={() => navigate('/brand')} className="back-button">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="wallet-title">Portefeuille</h1>
              <p className="wallet-subtitle">Gérez vos finances et paiements</p>
            </div>
          </div>
          <button className="wallet-add-funds-btn">
            <Plus size={16} />
            Ajouter des fonds
          </button>
        </div>

        {/* Balance Cards */}
        <div className="wallet-stats">
          <div className="wallet-card">
            <div className="wallet-card-icon green-bg">
              <DollarSign size={28} color="#16a34a" />
            </div>
            <div>
              <p className="label">Solde total</p>
              <p className="amount">0€</p>
              <div className="trend">
                <TrendingUp size={14} />
                +0% ce mois
              </div>
            </div>
          </div>

          <div className="wallet-card">
            <div className="wallet-card-icon yellow-bg">
              <ArrowUpRight size={28} color="#ca8a04" />
            </div>
            <div>
              <p className="label">En attente</p>
              <p className="amount">0€</p>
              <p className="note">Paiements en cours</p>
            </div>
          </div>

          <div className="wallet-card">
            <div className="wallet-card-icon blue-bg">
              <ArrowDownRight size={28} color="#2563eb" />
            </div>
            <div>
              <p className="label">Disponible</p>
              <p className="amount">0€</p>
              <p className="note">Prêt à utiliser</p>
            </div>
          </div>

          <div className="wallet-card">
            <div className="wallet-card-icon purple-bg">
              <Calendar size={28} color="#7c3aed" />
            </div>
            <div>
              <p className="label">Dépensé ce mois</p>
              <p className="amount">0€</p>
              <p className="note">Mois courant</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="wallet-section">
          <div className="section-header">
            <h2>Méthodes de paiement</h2>
            <button className="section-action">
              <Plus size={14} />
              Ajouter
            </button>
          </div>

          <div className="payment-methods">
            <div className="payment-method-card">
              <div className="method-info">
                <CreditCard size={24} />
                <div>
                  <p>Carte •••• 4242</p>
                  <p>Expire le 12/24</p>
                </div>
              </div>
              <span className="badge badge-green">Principal</span>
            </div>

            <div className="payment-method-card">
              <div className="method-info">
                <Banknote size={24} />
                <div>
                  <p>Compte bancaire</p>
                  <p>FR76 •••• 1234</p>
                </div>
              </div>
              <button className="btn-edit">Modifier</button>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="wallet-section">
          <div className="section-header">
            <h2>Transactions récentes</h2>
            <div className="section-tools">
              <div className="filter">
                <Filter size={16} />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">Toutes</option>
                  <option value="campaign_payment">Paiements campagnes</option>
                  <option value="deposit">Dépôts</option>
                  <option value="subscription">Abonnements</option>
                </select>
              </div>
              <button className="section-action">
                <Download size={16} />
                Exporter
              </button>
            </div>
          </div>

          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Campagne</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <p>{transaction.description}</p>
                      <small>
                        {transaction.type === 'campaign_payment' ? 'Paiement campagne' :
                          transaction.type === 'deposit' ? 'Dépôt' :
                          transaction.type === 'subscription' ? 'Abonnement' : 'Autre'}
                      </small>
                    </td>
                    <td>{transaction.campaign || '-'}</td>
                    <td className={transaction.amount > 0 ? 'green-text' : 'red-text'}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}€
                    </td>
                    <td>
                      <span className={`badge ${
                        transaction.status === 'completed' ? 'badge-green' :
                        transaction.status === 'pending' ? 'badge-yellow' : 'badge-red'
                      }`}>
                        {transaction.status === 'completed' ? 'Complété' :
                         transaction.status === 'pending' ? 'En attente' : 'Échoué'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BrandWallet;
