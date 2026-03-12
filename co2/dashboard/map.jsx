import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const bestRoute = state?.bestRoute;

  useEffect(() => {
    if (!bestRoute?.geometry) return;

    const coordinates = bestRoute.geometry.coordinates;
    const latLngs = coordinates.map(([lng, lat]) => [lat, lng]);
    const startLatLng = latLngs[0];
    const endLatLng = latLngs[latLngs.length - 1];

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(startLatLng, 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const routeLine = L.polyline(latLngs, {
      color: '#22c55e',
      weight: 5,
      opacity: 0.9,
    }).addTo(map);

    const makeIcon = (color) => L.divIcon({
      className: '',
      html: `<div style="background:${color};border:3px solid white;border-radius:50%;width:14px;height:14px;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
      iconAnchor: [7, 7],
    });

    L.marker(startLatLng, { icon: makeIcon('#22c55e') }).addTo(map).bindPopup('Start').openPopup();
    L.marker(endLatLng, { icon: makeIcon('#ef4444') }).addTo(map).bindPopup('Destination');

    map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });

  }, [bestRoute]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (!bestRoute) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Mono&display=swap');
          .empty-screen {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #030712;
            gap: 1rem;
            font-family: 'DM Mono', monospace;
            padding: 1rem;
            text-align: center;
          }
          .empty-text { color: #64748b; font-size: 0.9rem; }
          .back-btn {
            background: transparent;
            border: 1px solid #1e293b;
            color: #94a3b8;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'DM Mono', monospace;
            font-size: 0.8rem;
          }
        `}</style>
        <div className="empty-screen">
          <p className="empty-text">No route data found.</p>
          <button className="back-btn" onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .map-wrapper {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #030712;
          font-family: 'DM Mono', monospace;
        }

        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.7rem 1rem;
          background: #0a0f1a;
          border-bottom: 1px solid #1e293b;
          z-index: 1000;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .back-btn {
          background: transparent;
          border: 1px solid #1e293b;
          color: #94a3b8;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .pills-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .info-pill {
          background: #0f172a;
          border: 1px solid #1e293b;
          color: #e2e8f0;
          padding: 0.3rem 0.7rem;
          border-radius: 20px;
          font-size: 0.7rem;
          white-space: nowrap;
        }

        .map-container {
          flex: 1;
          width: 100%;
          z-index: 0;
        }

        @media (max-width: 480px) {
          .top-bar { justify-content: flex-start; }
          .info-pill { font-size: 0.65rem; padding: 0.25rem 0.55rem; }
        }
      `}</style>

      <div className="map-wrapper">
        <div className="top-bar">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <div className="pills-row">
            <span className="info-pill">📍 {bestRoute.distanceKm} km</span>
            <span className="info-pill">⏱ {bestRoute.duration}</span>
            <span className="info-pill">🌿 {bestRoute.engineVehicle.co2EmittedKg} kg CO₂</span>
          </div>
        </div>
        <div ref={mapRef} className="map-container" />
      </div>
    </>
  );
};

export default Map;