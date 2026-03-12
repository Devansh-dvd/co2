import { useState, useEffect, useRef } from "react";

const FONT = "'DM Mono', 'Courier New', monospace";
const DISPLAY = "'Space Grotesk', 'Segoe UI', sans-serif";

const vehicles = [
  { id: "TRK-001", type: "Diesel", route: "Mumbai → Pune", driver: "Raj K.", co2: 42.3, fuel: 18.2, status: "active", lat: 19.076, lng: 72.877, progress: 65, load: 82 },
  { id: "EV-002", type: "Electric", route: "Delhi → Agra", driver: "Priya S.", co2: 0, fuel: 0, status: "active", lat: 28.704, lng: 77.102, progress: 40, load: 71 },
  { id: "HYB-003", type: "Hybrid", route: "Bangalore → Chennai", driver: "Arjun M.", co2: 18.7, fuel: 8.1, status: "active", lat: 12.972, lng: 77.594, progress: 78, load: 55 },
  { id: "TRK-004", type: "Diesel", route: "Kolkata → Dhanbad", driver: "Suman D.", co2: 55.1, fuel: 23.4, status: "idle", lat: 22.572, lng: 88.363, progress: 0, load: 0 },
  { id: "EV-005", type: "Electric", route: "Hyderabad → Vijayawada", driver: "Kavya R.", co2: 0, fuel: 0, status: "charging", lat: 17.385, lng: 78.487, progress: 0, load: 88 },
  { id: "HYB-006", type: "Hybrid", route: "Jaipur → Ahmedabad", driver: "Ravi P.", co2: 22.4, fuel: 9.7, status: "active", lat: 26.912, lng: 75.787, progress: 32, load: 63 },
];

const hourlyEmissions = [12, 18, 24, 31, 38, 44, 39, 47, 52, 58, 62, 54, 49, 43, 55, 61, 67, 58, 52, 46, 38, 29, 22, 16];
const routeData = [
  { name: "Eco Route A", co2: 18, time: 4.2, fuel: 7.8 },
  { name: "Standard B", co2: 42, time: 3.8, fuel: 18.2 },
  { name: "Eco Route C", co2: 22, time: 4.5, fuel: 9.1 },
  { name: "Highway D", co2: 61, time: 3.1, fuel: 26.4 },
  { name: "Eco Route E", co2: 15, time: 4.8, fuel: 6.3 },
];

const VEHICLE_COLORS = { Diesel: "#e24b4a", Electric: "#1d9e75", Hybrid: "#ba7517" };
const STATUS_COLORS = { active: "#1d9e75", idle: "#888780", charging: "#378add" };

function AnimatedNumber({ value, suffix = "", decimals = 1 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    const duration = 1200;
    const step = (timestamp) => {
      if (!ref.current) ref.current = timestamp;
      const progress = Math.min((timestamp - ref.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(+(start + (end - start) * eased).toFixed(decimals));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    return () => { ref.current = null; };
  }, [value]);
  return <span>{display.toLocaleString()}{suffix}</span>;
}

function PulsingDot({ color }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: 10, height: 10 }}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: color, opacity: 0.3,
        animation: "pulse 1.8s ease-in-out infinite"
      }} />
      <span style={{
        position: "absolute", inset: 2, borderRadius: "50%",
        background: color
      }} />
    </span>
  );
}

function MetricCard({ label, value, suffix, sub, color, icon, decimals = 1, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: 16,
      padding: "1.25rem 1.5rem",
      borderTop: `3px solid ${color}`,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
      display: "flex", flexDirection: "column", gap: 6
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, fontFamily: FONT, color: "var(--color-text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, fontFamily: DISPLAY, color: "var(--color-text-primary)" }}>
        {visible ? <AnimatedNumber value={value} suffix={suffix} decimals={decimals} /> : "—"}
      </div>
      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: FONT }}>{sub}</div>
    </div>
  );
}

function EmissionsChart() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const w = canvasRef.current.width = canvasRef.current.offsetWidth;
    const h = canvasRef.current.height = 160;
    const pad = { l: 36, r: 12, t: 12, b: 28 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
    const max = Math.max(...hourlyEmissions);
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = "rgba(128,128,128,0.12)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + ch - (i / 4) * ch;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + cw, y); ctx.stroke();
    }

    // Area fill
    const pts = hourlyEmissions.map((v, i) => [pad.l + (i / 23) * cw, pad.t + ch - (v / max) * ch]);
    const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
    grad.addColorStop(0, "rgba(29,158,117,0.3)");
    grad.addColorStop(1, "rgba(29,158,117,0)");
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pad.t + ch);
    pts.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.lineTo(pts[pts.length - 1][0], pad.t + ch);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
    ctx.strokeStyle = "#1d9e75";
    ctx.lineWidth = 2;
    ctx.stroke();

    // X labels
    ctx.fillStyle = "rgba(128,128,128,0.7)";
    ctx.font = `10px ${FONT}`;
    ctx.textAlign = "center";
    [0, 6, 12, 18, 23].forEach(i => {
      const x = pad.l + (i / 23) * cw;
      ctx.fillText(`${i}:00`, x, h - 6);
    });

    // Y labels
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + ch - (i / 4) * ch;
      ctx.fillText(`${Math.round((i / 4) * max)}`, pad.l - 4, y + 4);
    }
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: 160, display: "block" }} />;
}

function RouteBar({ name, co2, maxCo2, delay }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW((co2 / maxCo2) * 100), delay);
    return () => clearTimeout(t);
  }, []);
  const isEco = name.startsWith("Eco");
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, fontFamily: FONT }}>
        <span style={{ color: isEco ? "#1d9e75" : "var(--color-text-secondary)" }}>{name}</span>
        <span style={{ color: "var(--color-text-primary)" }}>{co2} kg CO₂</span>
      </div>
      <div style={{ height: 8, background: "var(--color-background-secondary)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${w}%`, borderRadius: 4,
          background: isEco ? "#1d9e75" : "#e24b4a",
          transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)"
        }} />
      </div>
    </div>
  );
}

function VehicleRow({ v, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, []);
  return (
    <tr style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(-16px)",
      transition: "opacity 0.4s ease, transform 0.4s ease"
    }}>
      <td style={{ padding: "10px 8px", fontFamily: FONT, fontSize: 12, color: VEHICLE_COLORS[v.type] }}>{v.id}</td>
      <td style={{ padding: "10px 8px", fontSize: 13 }}>
        <div style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{v.route}</div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontFamily: FONT }}>{v.driver}</div>
      </td>
      <td style={{ padding: "10px 8px" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11, fontFamily: FONT, padding: "3px 8px", borderRadius: 6,
          background: v.type === "Electric" ? "rgba(29,158,117,0.12)" : v.type === "Hybrid" ? "rgba(186,117,23,0.12)" : "rgba(226,75,74,0.12)",
          color: VEHICLE_COLORS[v.type]
        }}>
          <PulsingDot color={VEHICLE_COLORS[v.type]} /> {v.type}
        </span>
      </td>
      <td style={{ padding: "10px 8px" }}>
        <div style={{ width: 80, height: 6, background: "var(--color-background-secondary)", borderRadius: 3 }}>
          <div style={{ height: "100%", width: `${v.progress}%`, background: "#378add", borderRadius: 3 }} />
        </div>
        <div style={{ fontSize: 10, color: "var(--color-text-secondary)", marginTop: 2, fontFamily: FONT }}>{v.progress}%</div>
      </td>
      <td style={{ padding: "10px 8px", fontFamily: FONT, fontSize: 13, color: v.co2 === 0 ? "#1d9e75" : "var(--color-text-primary)" }}>
        {v.co2 === 0 ? "0 ✓" : `${v.co2} kg`}
      </td>
      <td style={{ padding: "10px 8px" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 11, fontFamily: FONT, padding: "3px 8px", borderRadius: 6,
          background: `${STATUS_COLORS[v.status]}22`,
          color: STATUS_COLORS[v.status]
        }}>
          <PulsingDot color={STATUS_COLORS[v.status]} /> {v.status}
        </span>
      </td>
    </tr>
  );
}

export default function CarbonFleetDashboard() {
  const [tab, setTab] = useState("overview");
  const [time, setTime] = useState(new Date());
  const [alertDismissed, setAlertDismissed] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const totalCO2 = vehicles.filter(v => v.status === "active").reduce((a, v) => a + v.co2, 0).toFixed(1);
  const totalFuel = vehicles.filter(v => v.status === "active").reduce((a, v) => a + v.fuel, 0).toFixed(1);
  const evCount = vehicles.filter(v => v.type === "Electric").length;
  const evPct = ((evCount / vehicles.length) * 100).toFixed(0);
  const activeCount = vehicles.filter(v => v.status === "active").length;

  return (
    <div style={{ fontFamily: DISPLAY, background: "var(--color-background-tertiary)", minHeight: "100vh", padding: "1.5rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600&display=swap');
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:0.3} 50%{transform:scale(2.2);opacity:0} }
        @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .tab-btn { background:none; border:none; cursor:pointer; padding:8px 16px; border-radius:8px; font-family:inherit; font-size:13px; font-weight:500; color:var(--color-text-secondary); transition:all 0.2s; }
        .tab-btn.active { background:var(--color-background-primary); color:var(--color-text-primary); border:0.5px solid var(--color-border-tertiary); }
        .tab-btn:hover:not(.active) { background:var(--color-background-secondary); }
        tr:hover td { background: var(--color-background-secondary); }
        td { transition: background 0.2s; }
      `}</style>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "1.5rem",
        animation: "fadeSlideDown 0.5s ease"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg,#0f6e56,#1d9e75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20
          }}>🌿</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "var(--color-text-primary)" }}>Carbon-Aware Fleet</h1>
            <p style={{ margin: 0, fontSize: 12, fontFamily: FONT, color: "var(--color-text-secondary)" }}>Scheduling & Emissions Monitor</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(29,158,117,0.1)", border: "0.5px solid rgba(29,158,117,0.3)",
            padding: "6px 12px", borderRadius: 8
          }}>
            <PulsingDot color="#1d9e75" />
            <span style={{ fontSize: 12, fontFamily: FONT, color: "#1d9e75" }}>LIVE</span>
          </div>
          <span style={{ fontSize: 12, fontFamily: FONT, color: "var(--color-text-secondary)" }}>
            {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Alert Banner */}
      {!alertDismissed && (
        <div style={{
          background: "rgba(186,117,23,0.1)", border: "0.5px solid rgba(186,117,23,0.4)",
          borderRadius: 10, padding: "10px 16px", marginBottom: "1.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          animation: "fadeSlideDown 0.4s ease 0.3s both"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13, color: "#ba7517" }}>
              <strong>TRK-004</strong> idle 2h 14min — recommend EV swap for Kolkata → Dhanbad route. Est. savings: <strong>55.1 kg CO₂</strong>
            </span>
          </div>
          <button onClick={() => setAlertDismissed(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ba7517", fontSize: 16 }}>×</button>
        </div>
      )}

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        <MetricCard label="Total CO₂ Today" value={totalCO2} suffix=" kg" sub="↓ 12% vs yesterday" color="#e24b4a" icon="🏭" delay={0} />
        <MetricCard label="Fuel Consumed" value={totalFuel} suffix=" L" sub="4 active diesel vehicles" color="#ba7517" icon="⛽" delay={80} />
        <MetricCard label="Carbon Saved" value={134.7} suffix=" kg" sub="via eco-route scheduling" color="#1d9e75" icon="🌱" delay={160} />
        <MetricCard label="Active Deliveries" value={activeCount} suffix="" sub={`${vehicles.length} total in fleet`} color="#378add" icon="🚛" decimals={0} delay={240} />
        <MetricCard label="EV Utilization" value={evPct} suffix="%" sub={`${evCount} of ${vehicles.length} vehicles electric`} color="#5dcaa5" icon="⚡" decimals={0} delay={320} />
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 4, background: "var(--color-background-secondary)",
        padding: 4, borderRadius: 10, marginBottom: "1.5rem",
        border: "0.5px solid var(--color-border-tertiary)", width: "fit-content"
      }}>
        {["overview", "routes", "vehicles", "esg"].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {{ overview: "📊 Overview", routes: "🗺 Routes", vehicles: "🚛 Fleet", esg: "📋 ESG Report" }[t]}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animation: "fadeSlideDown 0.3s ease" }}>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: "1.25rem" }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: "var(--color-text-secondary)", fontFamily: FONT }}>HOURLY EMISSIONS (kg CO₂)</div>
            <EmissionsChart />
          </div>

          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: "1.25rem" }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: "var(--color-text-secondary)", fontFamily: FONT }}>VEHICLE TYPE BREAKDOWN</div>
            {[
              { type: "Electric", count: 2, pct: 33, color: "#1d9e75" },
              { type: "Hybrid", count: 2, pct: 33, color: "#ba7517" },
              { type: "Diesel", count: 2, pct: 33, color: "#e24b4a" },
            ].map((item, i) => (
              <div key={item.type} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: item.color, fontWeight: 500 }}>{item.type}</span>
                  <span style={{ fontFamily: FONT, color: "var(--color-text-secondary)", fontSize: 12 }}>{item.count} vehicles · {item.pct}%</span>
                </div>
                <div style={{ height: 10, background: "var(--color-background-secondary)", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${item.pct}%`, borderRadius: 5, background: item.color,
                    animation: `fadeSlideDown 0.6s ease ${i * 0.15 + 0.2}s both`
                  }} />
                </div>
              </div>
            ))}

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: "var(--color-text-secondary)", fontFamily: FONT }}>EMISSIONS BY TYPE</div>
              {[
                { label: "Diesel fleet", val: "97.4 kg CO₂/day", bar: 100, color: "#e24b4a" },
                { label: "Hybrid fleet", val: "41.1 kg CO₂/day", bar: 42, color: "#ba7517" },
                { label: "Electric fleet", val: "0 kg CO₂/day", bar: 0, color: "#1d9e75" },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3, fontFamily: FONT }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>{item.label}</span>
                    <span style={{ color: item.val.startsWith("0") ? "#1d9e75" : "var(--color-text-primary)" }}>{item.val}</span>
                  </div>
                  <div style={{ height: 6, background: "var(--color-background-secondary)", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${item.bar}%`, background: item.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Routes */}
      {tab === "routes" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animation: "fadeSlideDown 0.3s ease" }}>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: "1.25rem" }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: "var(--color-text-secondary)", fontFamily: FONT }}>CO₂ COMPARISON BY ROUTE</div>
            {routeData.map((r, i) => (
              <RouteBar key={r.name} name={r.name} co2={r.co2} maxCo2={61} delay={i * 100 + 100} />
            ))}
            <div style={{ marginTop: 16, padding: "10px 12px", background: "rgba(29,158,117,0.08)", border: "0.5px solid rgba(29,158,117,0.25)", borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: "#1d9e75", fontFamily: FONT }}>🌿 Eco routes save avg <strong>68%</strong> emissions vs standard highways</div>
            </div>
          </div>

          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: "1.25rem" }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: "var(--color-text-secondary)", fontFamily: FONT }}>ROUTE RECOMMENDATIONS</div>
            {[
              { from: "TRK-004", current: "Highway D", eco: "Eco Route A", saving: "46 kg CO₂", type: "urgent" },
              { from: "TRK-001", current: "Standard B", eco: "Eco Route C", saving: "20.1 kg CO₂", type: "suggested" },
              { from: "HYB-006", current: "Standard B", eco: "Eco Route E", saving: "27 kg CO₂", type: "suggested" },
            ].map((r, i) => (
              <div key={i} style={{
                padding: "12px", borderRadius: 10,
                border: `0.5px solid ${r.type === "urgent" ? "rgba(226,75,74,0.3)" : "var(--color-border-tertiary)"}`,
                background: r.type === "urgent" ? "rgba(226,75,74,0.05)" : "var(--color-background-secondary)",
                marginBottom: 10
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, fontFamily: FONT, color: VEHICLE_COLORS[vehicles.find(v => v.id === r.from)?.type || "Diesel"] }}>{r.from}</span>
                  <span style={{ fontSize: 11, fontFamily: FONT, background: "rgba(29,158,117,0.12)", color: "#1d9e75", padding: "2px 8px", borderRadius: 5 }}>−{r.saving}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                  <span style={{ color: "#e24b4a" }}>{r.current}</span> → <span style={{ color: "#1d9e75" }}>{r.eco}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Vehicles */}
      {tab === "vehicles" && (
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, overflow: "hidden", animation: "fadeSlideDown 0.3s ease" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--color-background-secondary)" }}>
                {["Vehicle ID", "Route / Driver", "Type", "Progress", "CO₂ Emission", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 8px", textAlign: "left", fontSize: 11, fontFamily: FONT, fontWeight: 500, color: "var(--color-text-secondary)", letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <VehicleRow key={v.id} v={v} delay={i * 80} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: ESG */}
      {tab === "esg" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, animation: "fadeSlideDown 0.3s ease" }}>
          {[
            { label: "Scope 1 Emissions", value: "138.5 tCO₂e", sub: "Direct fleet emissions YTD", trend: "-8.2%", positive: true, icon: "🏭" },
            { label: "Emission Intensity", value: "2.41 kg", sub: "CO₂ per km delivered", trend: "-11.4%", positive: true, icon: "📏" },
            { label: "Renewable Energy", value: "34%", sub: "EV charging from renewables", trend: "+5.1%", positive: true, icon: "☀️" },
            { label: "GHG Protocol Align.", value: "GHG-v2", sub: "Scope 1 & 2 compliant", trend: "Verified", positive: true, icon: "✅" },
            { label: "Carbon Offset", value: "22.4 tCO₂", sub: "Purchased this quarter", trend: "Q1 2025", positive: null, icon: "🌳" },
            { label: "ESG Score", value: "74/100", sub: "Fleet sustainability index", trend: "+6 pts MoM", positive: true, icon: "📊" },
          ].map((item, i) => (
            <div key={i} style={{
              background: "var(--color-background-primary)",
              border: "0.5px solid var(--color-border-tertiary)",
              borderRadius: 14, padding: "1.25rem",
              animation: `fadeSlideDown 0.4s ease ${i * 0.08}s both`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span style={{
                  fontSize: 11, fontFamily: FONT, padding: "3px 8px", borderRadius: 6,
                  background: item.positive === null ? "var(--color-background-secondary)" : item.positive ? "rgba(29,158,117,0.12)" : "rgba(226,75,74,0.12)",
                  color: item.positive === null ? "var(--color-text-secondary)" : item.positive ? "#1d9e75" : "#e24b4a"
                }}>{item.trend}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 4 }}>{item.value}</div>
              <div style={{ fontSize: 11, fontFamily: FONT, color: "var(--color-text-secondary)" }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}

          <div style={{ gridColumn: "1 / -1", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 14, padding: "1.25rem" }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: "var(--color-text-secondary)", fontFamily: FONT }}>MONTHLY EMISSION TREND (tCO₂)</div>
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 80 }}>
              {[14.2, 16.8, 13.1, 15.4, 12.9, 11.8, 10.4, 9.2, 10.7, 9.8, 8.1, 7.6].map((v, i) => {
                const max = 16.8;
                const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: "100%", height: `${(v / max) * 64}px`,
                      background: i >= 9 ? "#1d9e75" : "#9fe1cb",
                      borderRadius: "4px 4px 0 0",
                      transition: "height 0.8s ease"
                    }} />
                    <span style={{ fontSize: 9, fontFamily: FONT, color: "var(--color-text-secondary)" }}>{months[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: 11, fontFamily: FONT, color: "var(--color-text-secondary)" }}>
        Carbon-Aware Fleet Scheduling System · Data refreshes every 30s · Last sync: {time.toLocaleTimeString()}
      </div>
    </div>
  );
}
