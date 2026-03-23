import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HealthCard from './HealthCard';
import CriticalOverlay from './CriticalOverlay';
import { patients } from '../data/mockVitals';

export default function DoctorDashboard({ onLogout }) {
  const [activePatient, setActivePatient] = useState(patients[0]);
  const [mode, setMode] = useState('normal');

  function examineVitals(patient) {
    setActivePatient(patient);
  }

  function getHealthSummary() {
    const latest = activePatient.vitals[activePatient.vitals.length - 1];
    return {
      hr: latest.hr,
      spo2: latest.spo2,
      temp: latest.temp,
      status: latest.status
    };
  }

  const summary = getHealthSummary();

  return (
    <div className={`dashboard ${mode}`}>
      <CriticalOverlay
        active={mode === 'critical'}
        message="Patient critical parameter detected. Auto alert dispatched to emergency contact."
        onResolve={() => setMode('normal')}
      />
      <header>
        <h1>Doctor Dashboard</h1>
        <div className="header-actions">
          <button onClick={() => setMode((v) => (v === 'normal' ? 'critical' : 'normal'))}>
            {mode === 'normal' ? 'Switch to Critical Mode' : 'Switch to Normal Mode'}
          </button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <section className="doctor-top-row">
        <div className="patient-list">
          <h2>Patient Assignments</h2>
          <ul>
            {patients.map((p) => (
              <li key={p.id} className={p.id === activePatient.id ? 'active' : ''} onClick={() => examineVitals(p)}>
                <strong>{p.name}</strong>
                <small>Age {p.age}</small>
              </li>
            ))}
          </ul>
        </div>

        <div className="patient-summary">
          <h2>{activePatient.name} - Real Time Vital Modal</h2>
          <div className="health-grid">
            <HealthCard title="Heart Rate" value={summary.hr} unit=" BPM" severity={summary.status} icon="❤️" />
            <HealthCard title="SpO₂" value={summary.spo2} unit=" %" severity={summary.status} icon="🩸" />
            <HealthCard title="Temperature" value={summary.temp} unit=" °C" severity={summary.status} icon="🌡️" />
          </div>

          <div className="trend-box">
            <h3>Trend-Based Prediction & AI signature</h3>
            <p>
              This patient has early arrhythmia-like signature. Micro-fluctuations are detected with repeated
              SpO₂ dips and HR spikes in last 4 data points.
            </p>
          </div>

          <div className="chart-area">
            <ResponsiveContainer width="100%" height={270}>
              <LineChart data={activePatient.vitals}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hr" stroke="#e85252" strokeWidth={2} name="Heart Rate" />
                <Line type="monotone" dataKey="spo2" stroke="#2f9eea" strokeWidth={2} name="SpO₂" />
                <Line type="monotone" dataKey="temp" stroke="#f9a825" strokeWidth={2} name="Temp" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="ai-debate">
            <h3>AI Debate (Consensus + Disagreement)</h3>
            <p>Agent A: Normal condition (33%) | Agent B: Possible risk (48%) | Agent C: Need more data (19%)</p>
            <p>Final: Caution – moderate risk with local abnormal fingerprint. Disagreement 0.66</p>
          </div>

          <div className="action-row">
            <Link className="button" to="/doctor/simulate">Run future risk simulator</Link>
            <button onClick={() => alert('Emergency contact alert sent!')}>Send Alert</button>
          </div>
        </div>
      </section>
    </div>
  );
}
