import React, { useState } from 'react';
import { clientsData } from '../../data/clients';

export default function Clients() {
  const [selectedClient, setSelectedClient] = useState(null);

  const openModal = (client) => {
    setSelectedClient(client);
  };

  const closeModal = () => {
    setSelectedClient(null);
  };

  return (
    <section id="clients">
      <div className="inner">
        <div className="sec-head">
          <div>
            <div className="eyebrow reveal" style={{ marginBottom: '14px' }}>Client Ecosystem</div>
            <h2 className="reveal">Trusted across industries.</h2>
          </div>
          <p className="reveal">
            From deep-tech startups to global industrial conglomerates, we partner with teams who view software as core competitive leverage.
          </p>
        </div>

        {/* Desktop Client Wall */}
        <div className="client-wall" id="client-wall">
          {clientsData.map((client, idx) => {
            const rot = ((idx % 5) - 2) * 0.8;
            return (
              <div
                key={idx}
                className="client-chip"
                style={{ transform: `rotate(${rot}deg)` }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(0deg)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = `rotate(${rot}deg)`)}
                onClick={() => openModal(client)}
                tabIndex={0}
                role="button"
                aria-label={`View ${client[0]} details`}
              >
                {client[0]}
              </div>
            );
          })}
        </div>

        {/* Mobile Client Marquee */}
        <div className="mobile-client-marquee" aria-hidden="true">
          <div className="mobile-client-track">
            {clientsData.concat(clientsData).map((client, idx) => (
              <div
                key={idx}
                className="client-chip"
                onClick={() => openModal(client)}
              >
                {client[0]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Detail Modal */}
      <div
        id="client-modal"
        className={`client-modal ${selectedClient ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target.id === 'client-modal') closeModal();
        }}
        aria-hidden={!selectedClient}
      >
        {selectedClient && (
          <div className="client-card">
            <div className="eyebrow">Client Overview</div>
            <h3 id="modal-name">{selectedClient[0]}</h3>
            <p id="modal-desc">{selectedClient[2]}</p>
            <div className="tags" id="modal-tags">
              <span>{selectedClient[1]}</span>
              <span>Kodewar Partner</span>
            </div>
            <button
              type="button"
              className="client-close"
              id="modal-close"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
