import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import HealthCard from './HealthCard';
import CriticalOverlay from './CriticalOverlay';
import { patients } from '../data/mockVitals';

export default function PatientDashboard({ userId, onLogout }) {
  const patient = patients.find((p) => p.id === userId) || patients[0];
  const [mode, setMode] = useState('normal');
  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const latest = patient.vitals[patient.vitals.length - 1];

  function handleAnalyze() {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setScanResult({
        area: 'chest',
        severity: latest.status,
        message: latest.status === 'critical' ? 'High cardiovascular risk detected' : 'Mild irregularities observed',
        details: 'Irregular heart rate pattern with SpO₂ fluctuation'
      });
    }, 2000);
  }

  return (
    <div className={`dashboard ${mode} ${analyzing ? 'scanning' : ''}`}>
      <CriticalOverlay
        active={mode === 'critical'}
        message="Critical condition detected for your profile. Please consult medical professional immediately."
        onResolve={() => setMode('normal')}
      />

      {analyzing && (
        <div className="scan-overlay">
          <div className="scan-animation">
            <div className="human-silhouette">
              <div className="scan-wave"></div>
            </div>
            <p>Scanning body systems...</p>
          </div>
        </div>
      )}

      {scanResult && !analyzing && (
        <div className="scan-result">
          <div className={`affected-area ${scanResult.area} ${scanResult.severity}`}>
            <div className="glow-ring"></div>
            <div className="label-box">
              <strong>{scanResult.message}</strong>
              <p>{scanResult.details}</p>
            </div>
          </div>
        </div>
      )}

      <header>
        <h1>Patient Dashboard</h1>
        <div className="header-actions">
          <button onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? 'Analyzing...' : 'Analyze Health'}
          </button>
          <button onClick={() => setMode((v) => (v === 'normal' ? 'critical' : 'normal'))}>
            {mode === 'normal' ? 'Critical Alert Mode' : 'Back to Normal'}
          </button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="patient-card">
        <h2>{patient.name}</h2>
        <p>Age {patient.age} · Monitoring tag: {patient.id}</p>
      </div>

      <div className="health-grid">
        <HealthCard title="Heart Rate" value={latest.hr} unit=" BPM" severity={latest.status} icon="❤️" />
        <HealthCard title="SpO₂" value={latest.spo2} unit=" %" severity={latest.status} icon="🩸" />
        <HealthCard title="Temperature" value={latest.temp} unit=" °C" severity={latest.status} icon="🌡️" />
      </div>

      <div className="chart-area">
        <h3>Trend chart</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={patient.vitals} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="hr" stroke="#e85252" dot={true} name="HR" />
            <Line type="monotone" dataKey="spo2" stroke="#2f9eea" dot={true} name="SpO2" />
            <Line type="monotone" dataKey="temp" stroke="#f9a825" dot={true} name="Temp" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card details">
        <h3>Health Anomaly Fingerprint</h3>
        <p>Detected signature: mild cardiac rhythm drift + SPO2 downward micro-slope.</p>
        <ul>
          <li>Silent risk: irregular rhythm pattern under normal external values</li>
          <li>Recommendation: 15 min rest + re-check or visit cardiologist</li>
        </ul>
      </div>

      <div className="behavior-awareness">
        <h3>Behavior Aware Prediction</h3>
        <p>Based on sleep: 6.5h (adequate), stress level: moderate, activity: sedentary</p>
        <p>Risk adjustment: +15% cardiac load due to low activity pattern</p>
      </div>

      <div className="action-row">
        <Link className="button" to="/patient/simulator">Interactive risk simulator</Link>
        <button onClick={() => alert('Emergency alert sent to your contact!')}>Send Emergency Alert</button>
      </div>
    </div>
  );
}