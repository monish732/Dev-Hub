import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { patients } from '../data/mockVitals';

const API_BASE = 'http://localhost:5000/api'; // Pointing to our ML Flask server

const situationDescriptions = {
  'Normal': 'Vitals are stable and within normal baseline parameters. No immediate anomalies detected.',
  'Tachycardia': 'Elevated heart rate detected. This could indicate stress, cardiac exertion, or an early arrhythmia signature.',
  'Bradycardia': 'Unusually low heart rate detected. If not an athlete, monitor for dizziness or fatigue.',
  'Hypoxemia': 'Low blood oxygen levels detected. Shows potential respiratory restriction or circulatory insufficiency.',
  'Fever': 'Elevated body temperature detected, suggesting possible infection or inflammatory response.',
  'Hypertension': 'High blood pressure readings. Represents increased cardiovascular load.',
  'Hypotension': 'Low blood pressure detected. Could lead to fainting or indicate poor circulation.',
  'Emergency': 'Critical multi-vital failure pattern detected. Immediate medical intervention is highly recommended.'
};

function getSituationDescription(condition) {
  if (!condition) return '';
  const cleanCondition = condition.replace('_', ' ');
  for (const [key, desc] of Object.entries(situationDescriptions)) {
    if (cleanCondition.toLowerCase().includes(key.toLowerCase())) return desc;
  }
  return 'Pattern deviates from normal baseline. Continuous monitoring advised.';
}

export default function PatientDashboard({ userId, onLogout }) {
  const patient = patients.find((p) => p.id === userId) || patients[0];
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Vitals State for Auto-Update
  const [vitalsHistory, setVitalsHistory] = useState(patient.vitals);
  const originalLatest = patient.vitals[patient.vitals.length - 1];

  const [inputHr, setInputHr] = useState(originalLatest.hr);
  const [inputSpo2, setInputSpo2] = useState(originalLatest.spo2);
  const [inputTemp, setInputTemp] = useState(originalLatest.temp);

  // ML Results
  const [mlResult, setMlResult] = useState(null);

  // Combined ML Auto-Update (Model 01 & Model 07)
  useEffect(() => {
    const timer = setTimeout(async () => {
      const hrNum = Number(inputHr) || 0;
      const spo2Num = Number(inputSpo2) || 0;
      const tempNum = Number(inputTemp) || 0;

      // Update Trend Chart
      setVitalsHistory(prev => {
        const newHistory = [...prev];
        const lastIdx = newHistory.length - 1;
        newHistory[lastIdx] = { ...newHistory[lastIdx], hr: hrNum, spo2: spo2Num, temp: tempNum };
        return newHistory;
      });

      // 1. Fetch Model 01 (Current Classification)
      try {
        const res01 = await fetch(`${API_BASE}/predict/disease`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ heart_rate: hrNum, spo2: spo2Num, temperature: tempNum })
        });
        const data01 = await res01.json();
        if (data01.all_probabilities) {
           const chartData = Object.entries(data01.all_probabilities)
             .map(([name, prob]) => ({ name: name.replace('_', ' '), Probability: parseFloat((prob * 100).toFixed(1)) }))
             .sort((a, b) => b.Probability - a.Probability).slice(0, 5);
           setMlResult({ ...data01, chartData });
        }
      } catch (err) { console.error("Model 01 failed", err); }

    }, 400);
    return () => clearTimeout(timer);
  }, [inputHr, inputSpo2, inputTemp]);


  const healthMetrics = [
    { title: 'Heart Rate', value: inputHr, unit: 'BPM', icon: '❤️', status: inputHr > 100 ? 'critical' : 'good' },
    { title: 'Temperature', value: inputTemp, unit: '°C', icon: '🌡️', status: inputTemp > 38 ? 'warning' : 'good' },
    { title: 'SpO2', value: inputSpo2, unit: '%', icon: '💨', status: inputSpo2 < 94 ? 'critical' : 'normal' },
    { title: 'Blood Pressure', value: '116/72', unit: 'mmHg', icon: '📊', status: 'normal' },
  ];

  const doctors = [
    { name: 'Dr. Sarah Chen', specialty: 'Cardiologist', date: '21 Aug', time: '10:00 AM' },
    { name: 'Dr. Rajesh Kumar', specialty: 'Neurologist', date: 'Upcoming' },
    { name: 'Dr. Lisa Wong', specialty: 'Physiologist', date: 'Upcoming' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '24px' }}>💊</div>
          <h1 style={{ margin: 0, color: '#7C3AED', fontSize: '1.5rem', fontWeight: 'bold' }}>Patient Dashboard</h1>
        </div>
        <nav style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flex: 1 }}>
          {['Dashboard', 'Appointments', 'Settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} style={{ background: 'none', border: 'none', color: activeTab === tab.toLowerCase() ? '#7C3AED' : '#999', cursor: 'pointer', fontSize: '0.95rem', padding: '0.5rem 0', borderBottom: activeTab === tab.toLowerCase() ? '2px solid #7C3AED' : 'none', transition: 'all 0.3s' }}>{tab}</button>
          ))}
        </nav>
        <button onClick={onLogout} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
      </header>

      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {activeTab === 'dashboard' ? (
          <>
            {/* Real-time Modifiers - ONLY ON DASHBOARD */}
            <div className="card live-input-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#fff', padding: '1rem 2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '2rem', border: '1px solid #e9d5ff' }}>
              <h3 style={{ margin: 0, color: '#7C3AED', fontSize: '1rem' }}>⚡ Real-time Modifiers:</h3>
              <label style={{ fontSize: '0.9rem', color: '#666' }}>HR: <input type="number" value={inputHr} onChange={e => setInputHr(e.target.value)} style={{ width: '60px', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 5px' }}/></label>
              <label style={{ fontSize: '0.9rem', color: '#666' }}>SpO₂: <input type="number" value={inputSpo2} onChange={e => setInputSpo2(e.target.value)} style={{ width: '60px', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 5px' }}/></label>
              <label style={{ fontSize: '0.9rem', color: '#666' }}>Temp: <input type="number" value={inputTemp} step="0.1" onChange={e => setInputTemp(e.target.value)} style={{ width: '70px', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 5px' }}/></label>
              <small style={{ marginLeft: 'auto', color: '#a855f7', fontWeight: '600' }}>* AI Insights update live as you edit</small>
            </div>

            {/* 1. Health Metrics Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {healthMetrics.map((metric, idx) => (
                <div key={idx} style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: metric.status === 'critical' ? '4px solid #ef4444' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>{metric.icon}</span>
                    <span style={{ color: '#999', fontSize: '0.9rem' }}>{metric.title}</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: metric.status === 'critical' ? '#ef4444' : '#7C3AED', marginBottom: '4px' }}>{metric.value}</div>
                  <div style={{ color: '#999', fontSize: '0.85rem' }}>{metric.unit}</div>
                </div>
              ))}
            </div>

            {/* 2. Live Vital Trends (Full row) */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#7C3AED' }}>📈 Live Vital Trends</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={vitalsHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} /> <XAxis dataKey="time" hide /> <YAxis /> <Tooltip /> <Legend />
                  <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} dot={false} name="HR" />
                  <Line type="monotone" dataKey="spo2" stroke="#3b82f6" strokeWidth={2} dot={false} name="SpO2" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 3. ML Current Situation & Probabilities (Single Row) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.8rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ margin: '0 0 1.5rem 0', color: '#7C3AED', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📊</span> ML Current Situation
                  </h3>
                  {mlResult ? (
                    <div>
                      <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#7C3AED', lineHeight: 1 }}>{mlResult.predicted_condition.replace('_', ' ')}</div>
                      <p style={{ color: '#666', fontSize: '1rem', margin: '0.8rem 0' }}>Confidence: <strong>{(mlResult.confidence * 100).toFixed(1)}%</strong></p>
                      <div style={{ padding: '1.2rem', backgroundColor: '#f1f5f9', borderRadius: '12px', borderLeft: '5px solid #7C3AED' }}>
                        <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>{getSituationDescription(mlResult.predicted_condition)}</p>
                      </div>
                    </div>
                  ) : <p>Loading AI classification...</p>}
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.8rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ margin: '0 0 1.5rem 0', color: '#7C3AED', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🩺</span> Disease Probabilities
                  </h3>
                  {mlResult && mlResult.chartData && (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={mlResult.chartData} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" domain={[0, 100]} hide /> <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fontWeight: 500 }} /> <Tooltip />
                        <Bar dataKey="Probability" fill="#7C3AED" radius={[0, 6, 6, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
            </div>

            {/* 4. Bottom Utilities Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Left Column: Stacked Simulation & Scan */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.8rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#7C3AED', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🧩</span> What-If Engine
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1.5rem' }}>Predict future health trajectories and risk scores using advanced simulation (Model 07).</p>
                  <button 
                    onClick={() => navigate('/patient/simulator')}
                    style={{ width: '100%', padding: '1rem', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1rem' }}
                  >
                    <span>📅 Open Full Simulator</span>
                    <span style={{ fontSize: '1.2rem' }}>→</span>
                  </button>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.8rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#7C3AED', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🧬</span> Targeted Scan
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>Launch advanced AI diagnostics and 3D Digital Twin visualization for deep health analysis.</p>
                  <button 
                    onClick={() => navigate('/patient/scan')}
                    style={{ width: '100%', padding: '1rem', backgroundColor: '#0f172a', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', fontSize: '1rem' }}
                  >
                    <span>⚡ Launch Scan</span>
                    <span style={{ fontSize: '1.1rem' }}>→</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Care Team */}
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.8rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#7C3AED', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👨‍⚕️</span> Care Team
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {doctors.map((doctor, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#7C3AED', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{doctor.name[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1e293b' }}>{doctor.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{doctor.specialty}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', color: '#7C3AED', fontWeight: '600' }}>{doctor.date}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{doctor.time || 'Available'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </>
        ) : (
          <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏗️</div>
            <h2 style={{ color: '#7C3AED' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
            <p style={{ color: '#666' }}>This section is currently under development to bring you a better care experience.</p>
          </div>
        )}
      </main>
    </div>
  );
}

