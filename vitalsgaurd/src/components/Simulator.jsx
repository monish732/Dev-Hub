import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Simulator() {
  const [hr, setHr] = useState(75);
  const [spo2, setSpo2] = useState(98);
  const navigate = useNavigate();

  function calculateRisks() {
    const risks = [];
    if (hr > 90) {
      risks.push({ time: '2 hours', risk: 'Increased cardiac stress', level: 'warning' });
      risks.push({ time: '6 hours', risk: 'Possible arrhythmia onset', level: 'critical' });
    } else if (hr > 80) {
      risks.push({ time: '2 hours', risk: 'Mild stress elevation', level: 'stable' });
      risks.push({ time: '6 hours', risk: 'Monitor for escalation', level: 'warning' });
    } else {
      risks.push({ time: '2 hours', risk: 'Stable condition', level: 'stable' });
      risks.push({ time: '6 hours', risk: 'Low risk profile', level: 'stable' });
    }

    if (spo2 < 95) {
      risks.push({ time: '2 hours', risk: 'Hypoxemia risk', level: 'warning' });
      risks.push({ time: '6 hours', risk: 'Respiratory distress possible', level: 'critical' });
    } else if (spo2 < 97) {
      risks.push({ time: '2 hours', risk: 'Mild oxygen desaturation', level: 'warning' });
      risks.push({ time: '6 hours', risk: 'Monitor oxygen levels', level: 'stable' });
    }

    return risks;
  }

  const risks = calculateRisks();

  return (
    <div className="simulator-page">
      <header>
        <h1>Interactive Health Risk Simulator</h1>
        <button onClick={() => navigate(-1)}>Back to Dashboard</button>
      </header>

      <div className="simulator-controls">
        <div className="control-group">
          <label>Heart Rate (BPM)</label>
          <input
            type="range"
            min="50"
            max="120"
            value={hr}
            onChange={e => setHr(Number(e.target.value))}
          />
          <span>{hr} BPM</span>
        </div>

        <div className="control-group">
          <label>SpO₂ (%)</label>
          <input
            type="range"
            min="85"
            max="100"
            value={spo2}
            onChange={e => setSpo2(Number(e.target.value))}
          />
          <span>{spo2}%</span>
        </div>
      </div>

      <div className="risk-projections">
        <h2>Projected Health Risks</h2>
        {risks.map((risk, idx) => (
          <div key={idx} className={`risk-item ${risk.level}`}>
            <strong>{risk.time}:</strong> {risk.risk}
          </div>
        ))}
      </div>

      <div className="ai-insight">
        <h3>AI Analysis</h3>
        <p>Based on current parameters, the system predicts {risks.length > 0 ? risks[0].risk.toLowerCase() : 'stable condition'} with {hr > 90 || spo2 < 95 ? 'moderate' : 'low'} confidence.</p>
      </div>
    </div>
  );
}