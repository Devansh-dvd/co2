import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatest = async () => {
      try {
  const res = await fetch('http://localhost:8000/api/map/vehicle/latest');
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading) return (
    <div style={styles.screen}>
      <div style={styles.spinner} />
      <p style={styles.loadText}>Fetching latest route...</p>
    </div>
  );

  if (error) return (
    <div style={styles.screen}>
      <p style={styles.errorText}>⚠ {error}</p>
      <button style={styles.retryBtn} onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div style={styles.screen}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .idx-card { background: #0a0f1a; border: 1px solid #1e293b; border-radius: 16px; padding: 2rem; width: 100%; max-width: 480px; display: flex; flex-direction: column; gap: 1.5rem; }
        .idx-badge { color: #22c55e; font-size: 0.6rem; letter-spacing: 0.2em; }
        .idx-title { font-family: 'Syne', sans-serif; color: #f1f5f9; font-size: clamp(1.4rem, 4vw, 2rem); font-weight: 800; letter-spacing: -0.02em; }
        .idx-row { display: flex; align-items: center; gap: 0.7rem; background: #0f172a; border-radius: 10px; padding: 0.9rem 1rem; }
        .idx-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .idx-label { color: #475569; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.2rem; }
        .idx-val { color: #e2e8f0; font-size: 0.85rem; font-weight: 500; }
        .idx-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
        .idx-stat { background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 0.85rem; }
        .idx-stat-val { color: #f1f5f9; font-size: 1.1rem; font-weight: 600; margin-top: 0.3rem; }
        .idx-unit { color: #475569; font-size: 0.65rem; }
        .idx-btn { background: #22c55e; color: #030712; border: none; border-radius: 10px; padding: 0.9rem; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.05em; cursor: pointer; font-family: 'DM Mono', monospace; transition: background 0.2s; }
        .idx-btn:hover { background: #16a34a; }
      `}</style>

      <div className="idx-card">
        <div>
          <p className="idx-badge">LATEST TRIP</p>
          <h1 className="idx-title">Route Overview</h1>
        </div>

        <div className="idx-row">
          <span className="idx-dot" style={{ background: '#22c55e' }} />
          <div>
            <p className="idx-label">From</p>
            <p className="idx-val">{data.vehicle.currentLocation.address}</p>
          </div>
        </div>

        <div className="idx-row">
          <span className="idx-dot" style={{ background: '#ef4444' }} />
          <div>
            <p className="idx-label">To</p>
            <p className="idx-val">{data.vehicle.destination.address}</p>
          </div>
        </div>

        <div className="idx-grid">
          <div className="idx-stat">
            <p className="idx-label">Distance</p>
            <p className="idx-stat-val">{data.bestRoute.distanceKm} <span className="idx-unit">km</span></p>
          </div>
          <div className="idx-stat">
            <p className="idx-label">Duration</p>
            <p className="idx-stat-val">{data.bestRoute.duration}</p>
          </div>
          <div className="idx-stat">
            <p className="idx-label">CO₂ Emitted</p>
            <p className="idx-stat-val">{data.bestRoute.engineVehicle.co2EmittedKg} <span className="idx-unit">kg</span></p>
          </div>
          <div className="idx-stat">
            <p className="idx-label">Vehicle Type</p>
            <p className="idx-stat-val">{data.vehicle.vehicleType}</p>
          </div>
        </div>

        <button
          className="idx-btn"
          onClick={() => navigate('/report', { state: { data } })}
        >
          View Full Report →
        </button>
      </div>
    </div>
  );
};

const styles = {
  screen: {
    minHeight: '100vh',
    background: '#030712',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    fontFamily: "'DM Mono', monospace",
    gap: '1rem',
  },
  loadText: { color: '#64748b', fontSize: '0.85rem' },
  errorText: { color: '#ef4444', fontSize: '0.85rem' },
  retryBtn: {
    background: 'transparent',
    border: '1px solid #1e293b',
    color: '#94a3b8',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'monospace',
  },
  spinner: {
    width: '28px', height: '28px',
    border: '3px solid #1e293b',
    borderTop: '3px solid #22c55e',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

export default Index;