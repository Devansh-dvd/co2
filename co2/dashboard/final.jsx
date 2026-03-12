import { useLocation, useNavigate } from 'react-router-dom';

const FUEL_PRICE_PER_LITRE = 103; // INR — update as needed

const getCarbonRating = (co2) => {
  if (co2 <= 20) return { grade: 'A', color: '#22c55e', label: 'Excellent' };
  if (co2 <= 40) return { grade: 'B', color: '#84cc16', label: 'Good' };
  if (co2 <= 70) return { grade: 'C', color: '#f59e0b', label: 'Moderate' };
  if (co2 <= 100) return { grade: 'D', color: '#f97316', label: 'Poor' };
  return { grade: 'F', color: '#ef4444', label: 'Critical' };
};

const now = new Date();
const formatTime = (date) =>
  date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
const formatDate = (date) =>
  date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const TripSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const bestRoute = state?.bestRoute;
  const origin = state?.origin || 'Origin';
  const destination = state?.destination || 'Destination';

  if (!bestRoute) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030712' }}>
        <p style={{ color: '#64748b', fontFamily: 'monospace' }}>No trip data found.</p>
      </div>
    );
  }

  const { engineVehicle, evVehicle, comparison, distanceKm, durationSeconds, duration } = bestRoute;

  const avgSpeedKmph = Math.round(distanceKm / (durationSeconds / 3600));
  const fuelCostINR = Math.round(engineVehicle.fuelConsumedLitres * FUEL_PRICE_PER_LITRE);
  const endTime = new Date(now.getTime() + durationSeconds * 1000);
  const rating = getCarbonRating(engineVehicle.co2EmittedKg);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #030712; }

        .ts-wrapper {
          min-height: 100vh;
          background: #030712;
          padding: 1.5rem;
          font-family: 'DM Mono', monospace;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ts-inner {
          width: 100%;
          max-width: 700px;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .ts-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.5rem;
        }

        .ts-back {
          background: transparent;
          border: 1px solid #1e293b;
          color: #64748b;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
        }

        .ts-back:hover { color: #e2e8f0; border-color: #334155; }

        .ts-date {
          color: #334155;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
        }

        .ts-hero {
          background: #0a0f1a;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 1.8rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .ts-hero-left { display: flex; flex-direction: column; gap: 0.4rem; }

        .ts-badge {
          color: #22c55e;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          font-weight: 600;
        }

        .ts-hero-title {
          font-family: 'Syne', sans-serif;
          color: #f1f5f9;
          font-size: clamp(1.3rem, 4vw, 1.8rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .ts-route-line {
          color: #64748b;
          font-size: 0.75rem;
          margin-top: 0.3rem;
        }

        .ts-rating-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          flex-shrink: 0;
        }

        .ts-rating-grade {
          font-family: 'Syne', sans-serif;
          font-size: 3rem;
          font-weight: 800;
          line-height: 1;
        }

        .ts-rating-label {
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: #64748b;
          text-transform: uppercase;
        }

        .ts-time-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.7rem;
        }

        @media (max-width: 480px) {
          .ts-time-row { grid-template-columns: 1fr 1fr; }
        }

        .ts-time-card {
          background: #0a0f1a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 0.9rem 1rem;
        }

        .ts-card-label {
          color: #475569;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }

        .ts-card-value {
          color: #f1f5f9;
          font-size: clamp(0.9rem, 2.5vw, 1.1rem);
          font-weight: 500;
        }

        .ts-card-sub {
          color: #475569;
          font-size: 0.65rem;
          margin-top: 0.2rem;
        }

        .ts-section-title {
          color: #334155;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid #0f172a;
        }

        .ts-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.7rem;
        }

        @media (max-width: 380px) {
          .ts-grid-2 { grid-template-columns: 1fr; }
        }

        .ts-stat {
          background: #0a0f1a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 1rem;
        }

        .ts-stat-val {
          color: #f1f5f9;
          font-size: clamp(1rem, 3vw, 1.25rem);
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .ts-stat-unit {
          color: #475569;
          font-size: 0.65rem;
          font-weight: 400;
        }

        .ts-ev-card {
          border: 1px solid;
          border-radius: 12px;
          padding: 1rem 1.2rem;
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
        }

        .ts-ev-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 0.1rem; }

        .ts-ev-title {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 0.35rem;
        }

        .ts-ev-details {
          color: #64748b;
          font-size: 0.7rem;
          line-height: 1.8;
        }

        .ts-comparison {
          background: #0a0f1a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .ts-bar-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #64748b;
          margin-bottom: 0.3rem;
        }

        .ts-bar-track {
          height: 8px;
          background: #0f172a;
          border-radius: 99px;
          overflow: hidden;
        }

        .ts-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 1s ease;
        }

        .ts-trees {
          background: #052e16;
          border: 1px solid #166534;
          border-radius: 12px;
          padding: 1rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }

        .ts-trees-text {
          color: #86efac;
          font-size: 0.8rem;
          line-height: 1.6;
        }

        .ts-download {
          background: #22c55e;
          color: #030712;
          border: none;
          border-radius: 10px;
          padding: 0.95rem;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
          width: 100%;
          transition: background 0.2s, transform 0.1s;
        }

        .ts-download:hover { background: #16a34a; }
        .ts-download:active { transform: scale(0.98); }
      `}</style>

      <div className="ts-wrapper">
        <div className="ts-inner">

          <div className="ts-topbar">
            <button className="ts-back" onClick={() => navigate(-1)}>← Back</button>
            <span className="ts-date">{formatDate(now)}</span>
          </div>

          <div className="ts-hero">
            <div className="ts-hero-left">
              <span className="ts-badge">TRIP SUMMARY</span>
              <h1 className="ts-hero-title">Trip<br />Complete</h1>
              <p className="ts-route-line">{origin} → {destination}</p>
            </div>
            <div className="ts-rating-box">
              <span className="ts-rating-grade" style={{ color: rating.color }}>{rating.grade}</span>
              <span className="ts-rating-label">Carbon Rating</span>
              <span style={{ color: rating.color, fontSize: '0.65rem', marginTop: '0.1rem' }}>{rating.label}</span>
            </div>
          </div>

          <p className="ts-section-title">Trip Timeline</p>
          <div className="ts-time-row">
            <div className="ts-time-card">
              <p className="ts-card-label">Departed</p>
              <p className="ts-card-value">{formatTime(now)}</p>
              <p className="ts-card-sub">{formatDate(now)}</p>
            </div>
            <div className="ts-time-card">
              <p className="ts-card-label">Estimated Arrival</p>
              <p className="ts-card-value">{formatTime(endTime)}</p>
              <p className="ts-card-sub">{formatDate(endTime)}</p>
            </div>
            <div className="ts-time-card">
              <p className="ts-card-label">Total Duration</p>
              <p className="ts-card-value">{duration}</p>
              <p className="ts-card-sub">Eco route used</p>
            </div>
          </div>

          <p className="ts-section-title">Distance & Speed</p>
          <div className="ts-grid-2">
            <div className="ts-stat">
              <p className="ts-card-label">Total Distance</p>
              <p className="ts-stat-val">{distanceKm} <span className="ts-stat-unit">km</span></p>
            </div>
            <div className="ts-stat">
              <p className="ts-card-label">Avg Speed</p>
              <p className="ts-stat-val">{avgSpeedKmph} <span className="ts-stat-unit">km/h</span></p>
            </div>
          </div>

          <p className="ts-section-title">Emissions & Fuel</p>
          <div className="ts-grid-2">
            <div className="ts-stat" style={{ borderColor: '#1e3a2f' }}>
              <p className="ts-card-label">Total CO₂ Emitted</p>
              <p className="ts-stat-val" style={{ color: '#4ade80' }}>{engineVehicle.co2EmittedKg} <span className="ts-stat-unit">kg</span></p>
            </div>
            <div className="ts-stat">
              <p className="ts-card-label">Fuel Consumed</p>
              <p className="ts-stat-val">{engineVehicle.fuelConsumedLitres} <span className="ts-stat-unit">L</span></p>
            </div>
            <div className="ts-stat">
              <p className="ts-card-label">Fuel Cost</p>
              <p className="ts-stat-val">₹{fuelCostINR}</p>
              <p className="ts-card-sub">@ ₹{FUEL_PRICE_PER_LITRE}/L</p>
            </div>
            <div className="ts-stat">
              <p className="ts-card-label">Vehicle Mileage</p>
              <p className="ts-stat-val">{engineVehicle.mileageKmpl} <span className="ts-stat-unit">kmpl</span></p>
            </div>
          </div>

          <p className="ts-section-title">EV Analysis</p>
          <div
            className="ts-ev-card"
            style={{
              background: evVehicle.isSufficient ? '#052e16' : '#1c0505',
              borderColor: evVehicle.isSufficient ? '#166534' : '#7f1d1d',
            }}
          >
            <span className="ts-ev-icon">{evVehicle.isSufficient ? '⚡' : '🔋'}</span>
            <div>
              <p className="ts-ev-title" style={{ color: evVehicle.isSufficient ? '#22c55e' : '#ef4444' }}>
                {evVehicle.isSufficient ? 'EV COULD COMPLETE THIS ROUTE' : 'EV RANGE INSUFFICIENT'}
              </p>
              <div className="ts-ev-details">
                <span>EV Range &nbsp;&nbsp;&nbsp;: {evVehicle.totalRangeKm} km</span><br />
                <span>Route Dist : {distanceKm} km</span><br />
                <span>Remaining &nbsp;: {evVehicle.rangeAfterTrip} km</span><br />
                <span>CO₂ by EV &nbsp;: 0 kg</span>
              </div>
            </div>
          </div>

          <p className="ts-section-title">Engine vs EV Comparison</p>
          <div className="ts-comparison">
            <div>
              <div className="ts-bar-label">
                <span>🚗 Engine — {engineVehicle.co2EmittedKg} kg CO₂</span>
                <span style={{ color: '#ef4444' }}>100%</span>
              </div>
              <div className="ts-bar-track">
                <div className="ts-bar-fill" style={{ width: '100%', background: '#ef4444' }} />
              </div>
            </div>
            <div>
              <div className="ts-bar-label">
                <span>⚡ EV — 0 kg CO₂</span>
                <span style={{ color: '#22c55e' }}>0%</span>
              </div>
              <div className="ts-bar-track">
                <div className="ts-bar-fill" style={{ width: '2%', background: '#22c55e' }} />
              </div>
            </div>
            <p style={{ color: '#22c55e', fontSize: '0.75rem', textAlign: 'center' }}>
              EV saves <strong>{comparison.co2SavedKg} kg</strong> of CO₂ on this route
            </p>
          </div>

          <div className="ts-trees">
            <span style={{ fontSize: '1.6rem' }}>🌳</span>
            <p className="ts-trees-text">
              This trip emitted CO₂ equivalent to cutting{' '}
              <strong style={{ color: '#22c55e' }}>{comparison.treesEquivalent} trees</strong>.
              Switching to EV would save all of it.
            </p>
          </div>

          <button className="ts-download" onClick={() => window.print()}>
            Download Report ↓
          </button>

        </div>
      </div>
    </>
  );
};

export default TripSummary;