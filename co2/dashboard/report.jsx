import { useNavigate } from 'react-router-dom';

const Report = ({ bestRoute, origin, destination }) => {
  const navigate = useNavigate();

  if (!bestRoute) return null;

  const { engineVehicle, evVehicle, comparison, distanceKm, duration } = bestRoute;

  const handleStartRouting = () => {
    navigate('/map', { state: { bestRoute } });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .report-wrapper {
          min-height: 100vh;
          background: #030712;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'DM Mono', monospace;
        }

        .report-card {
          background: #0a0f1a;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 2rem;
          width: 100%;
          max-width: 680px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .report-badge {
          color: #22c55e;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          font-weight: 600;
        }

        .report-title {
          color: #f1f5f9;
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.2rem, 4vw, 1.6rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-top: 0.3rem;
        }

        .route-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: #0f172a;
          border-radius: 10px;
          padding: 1rem;
          flex-wrap: wrap;
        }

        .location-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex: 1;
          min-width: 120px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .location-label {
          color: #64748b;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          margin-bottom: 0.2rem;
        }

        .location-value {
          color: #e2e8f0;
          font-size: 0.8rem;
          font-weight: 600;
          word-break: break-word;
        }

        .dashes {
          color: #334155;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          flex-shrink: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.7rem;
        }

        @media (max-width: 420px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .dashes { display: none; }
          .route-row { flex-direction: column; align-items: flex-start; }
        }

        .stat-card {
          border: 1px solid #1e293b;
          border-radius: 10px;
          padding: 0.9rem 1rem;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 0.35rem;
        }

        .stat-value {
          color: #f1f5f9;
          font-size: clamp(1rem, 3vw, 1.3rem);
          font-weight: 700;
        }

        .stat-unit {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 400;
        }

        .ev-banner {
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
          border: 1px solid;
          border-radius: 10px;
          padding: 1rem;
        }

        .ev-icon {
          font-size: 1.3rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .ev-title {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 0.3rem;
        }

        .ev-sub {
          color: #94a3b8;
          font-size: 0.7rem;
          line-height: 1.6;
        }

        .trees-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: #0f172a;
          border-radius: 10px;
          padding: 0.9rem 1rem;
        }

        .trees-text {
          color: #94a3b8;
          font-size: 0.8rem;
          line-height: 1.5;
        }

        .start-btn {
          background: #22c55e;
          color: #030712;
          border: none;
          border-radius: 10px;
          padding: 0.95rem;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          font-family: 'DM Mono', monospace;
          width: 100%;
        }

        .start-btn:hover { background: #16a34a; }
        .start-btn:active { transform: scale(0.98); }
      `}</style>

      <div className="report-wrapper">
        <div className="report-card">

          <div>
            <p className="report-badge">ECO REPORT</p>
            <h2 className="report-title">Route Summary</h2>
          </div>

          <div className="route-row">
            <div className="location-box">
              <span className="dot" style={{ background: '#22c55e' }} />
              <div>
                <p className="location-label">FROM</p>
                <p className="location-value">{origin}</p>
              </div>
            </div>
            <span className="dashes">- - - -</span>
            <div className="location-box">
              <span className="dot" style={{ background: '#ef4444' }} />
              <div>
                <p className="location-label">TO</p>
                <p className="location-value">{destination}</p>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card" style={{ background: '#0f172a' }}>
              <p className="stat-label">Shortest Route</p>
              <p className="stat-value">{distanceKm} <span className="stat-unit">km</span></p>
            </div>
            <div className="stat-card" style={{ background: '#0f172a' }}>
              <p className="stat-label">Duration</p>
              <p className="stat-value">{duration}</p>
            </div>
            <div className="stat-card" style={{ background: '#052e16' }}>
              <p className="stat-label">Total CO₂ Emission</p>
              <p className="stat-value">{engineVehicle.co2EmittedKg} <span className="stat-unit">kg</span></p>
            </div>
            <div className="stat-card" style={{ background: '#052e16' }}>
              <p className="stat-label">Fuel Consumed</p>
              <p className="stat-value">{engineVehicle.fuelConsumedLitres} <span className="stat-unit">L</span></p>
            </div>
            <div className="stat-card" style={{ background: '#0f172a' }}>
              <p className="stat-label">Vehicle Mileage</p>
              <p className="stat-value">{engineVehicle.mileageKmpl} <span className="stat-unit">kmpl</span></p>
            </div>
            <div className="stat-card" style={{ background: '#0f172a' }}>
              <p className="stat-label">CO₂ Saved by EV</p>
              <p className="stat-value">{comparison.co2SavedKg} <span className="stat-unit">kg</span></p>
            </div>
          </div>

          <div
            className="ev-banner"
            style={{
              background: evVehicle.isSufficient ? '#052e16' : '#1c0505',
              borderColor: evVehicle.isSufficient ? '#22c55e' : '#ef4444',
            }}
          >
            <span className="ev-icon">{evVehicle.isSufficient ? '⚡' : '🔋'}</span>
            <div>
              <p className="ev-title" style={{ color: evVehicle.isSufficient ? '#22c55e' : '#ef4444' }}>
                {evVehicle.isSufficient ? 'EV CAN COMPLETE THIS ROUTE' : 'EV CANNOT COMPLETE THIS ROUTE'}
              </p>
              <p className="ev-sub">
                EV Range: {evVehicle.totalRangeKm} km &nbsp;·&nbsp;
                Route: {distanceKm} km &nbsp;·&nbsp;
                Remaining: {evVehicle.rangeAfterTrip} km
              </p>
            </div>
          </div>

          <div className="trees-row">
            <span style={{ fontSize: '1.4rem' }}>🌳</span>
            <p className="trees-text">
              This trip emits CO₂ equivalent to cutting{' '}
              <strong style={{ color: '#22c55e' }}>{comparison.treesEquivalent} trees</strong>
            </p>
          </div>

          <button className="start-btn" onClick={handleStartRouting}>
            Start Routing →
          </button>

        </div>
      </div>
    </>
  );
};

export default Report;