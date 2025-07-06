import React from 'react';

export default function EmailError() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '80px' }}>
      <h1> Une erreur est survenue</h1>
      <p>Impossible de confirmer ton email pour le moment. Réessaie plus tard.</p>
    </div>
  );
}
