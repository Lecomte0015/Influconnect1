import React from 'react';
import { CreditCard, Calendar, CheckCircle, AlertCircle } from 'lucide-react';


const Subscription = () => {
  return (
    <div className="subscription-container">
      <h1 className="title">Mon Abonnement</h1>

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="plan-title">Plan</h2>
            <p className="status-text">Votre abonnement est ...</p>
          </div>
          <span className="status-badge">Statut</span>
        </div>

        <div className="info-grid">
          <div className="info-block">
            <div className="info-row">
              <Calendar className="icon" />
              <div>
                <p className="info-label">Période actuelle</p>
                <p className="info-value">Du ... au ...</p>
              </div>
            </div>

            <div className="info-row">
              <CreditCard className="icon" />
              <div>
                <p className="info-label">Moyen de paiement</p>
                <p className="info-value">Carte •••• ****</p>
              </div>
            </div>
          </div>

          <div className="info-block">
            <div className="info-row">
              <CheckCircle className="icon" />
              <div>
                <p className="info-label">Renouvellement automatique</p>
                <p className="info-value">...</p>
              </div>
            </div>

            <div className="info-row">
              <AlertCircle className="icon" />
              <div>
                <p className="info-label">Prochain paiement</p>
                <p className="info-value">...€ le ...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button className="btn btn-primary">Changer de plan</button>
          <button className="btn btn-secondary">Gérer le paiement</button>
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Historique de facturation</h2>
        <div className="table-container">
          <table className="billing-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Montant</th>
                <th>Statut</th>
                <th className="text-right">Facture</th>
              </tr>
            </thead>
            <tbody>
              {/*tdb  */}
              <tr>
                <td>--/--/----</td>
                <td>...</td>
                <td>...€</td>
                <td>
                  <span className="status-badge status-active">Payé</span>
                </td>
                <td className="text-right">
                  <a href="/Invoices" className="invoice-link">Télécharger</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
