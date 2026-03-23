import React, { useState } from 'react';
import axios from 'axios';
import DigitalTwin from './DigitalTwin';
import { patients } from '../data/mockVitals';

const API_BASE = 'http://localhost:8000/api';

export default function PatientDashboard({ userId, onLogout }) {
  const patient = patients.find((p) => p.id === userId) || patients[0];
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const latest = patient.vitals[patient.vitals.length - 1];

  const healthMetrics = [
    { title: 'Heart Rate', value: latest.hr, unit: 'BPM', icon: '❤️', status: 'good' },
    { title: 'Blood Sugar', value: '118', unit: 'mg/dL', icon: '🩸', status: 'normal' },
    { title: 'SpO2', value: latest.spo2, unit: '%', icon: '💨', status: 'normal' },
    { title: 'Blood Pressure', value: '116/72', unit: 'mmHg', icon: '📊', status: 'normal' },
  ];

  async function handleAnalyze() {
    setAnalyzing(true);
    setScanResult(null);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/analyze-vitals`, {
        heart_rate: latest.hr,
        spo2: latest.spo2,
        temperature: latest.temp,
        ecg_irregularity: (patient.id === 'p2' ? 0.72 : 0.0) // Demo specific
      });
      setScanResult(response.data);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Health analysis system is currently unavailable.');
    } finally {
      setAnalyzing(false);
    }
  }

  const doctors = [
    { name: 'Dr. Sarah Chen', specialty: 'Cardiologist', date: '21 Aug', time: '10:00 AM' },
    { name: 'Dr. Rajesh Kumar', specialty: 'Neurologist', date: 'Upcoming' },
    { name: 'Dr. Lisa Wong', specialty: 'Physiologist', date: 'Upcoming' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '24px' }}>💊</div>
          <h1 style={{ margin: 0, color: '#7C3AED', fontSize: '1.5rem', fontWeight: 'bold' }}>Patient Dashboard</h1>
        </div>
        
        <nav style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flex: 1 }}>
          {['Dashboard', 'Chat', 'Health Reports', 'Appointments', 'Settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab.toLowerCase() ? '#7C3AED' : '#999',
                cursor: 'pointer',
                fontSize: '0.95rem',
                padding: '0.5rem 0',
                borderBottom: activeTab === tab.toLowerCase() ? '2px solid #7C3AED' : 'none',
                transition: 'all 0.3s',
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        <button onClick={onLogout} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Health Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {healthMetrics.map((metric, idx) => (
            <div key={idx} style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.8rem' }}>{metric.icon}</span>
                <span style={{ color: '#999', fontSize: '0.9rem' }}>{metric.title}</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7C3AED', marginBottom: '4px' }}>{metric.value}</div>
              <div style={{ color: '#999', fontSize: '0.85rem' }}>{metric.unit}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Overall Health Status */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, color: '#7C3AED' }}>📊 Overall Health Status</h3>
                <button 
                  onClick={handleAnalyze} 
                  disabled={analyzing}
                  style={{ padding: '0.5rem 1rem', backgroundColor: analyzing ? '#d1d5db' : '#38bdf8', color: '#1e293b', border: 'none', borderRadius: '6px', cursor: analyzing ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                  {analyzing ? 'Scanning...' : 'Run AI Analysis ✨'}
                </button>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#7C3AED', marginBottom: '1rem' }}>89%</div>
              <p style={{ color: '#666', margin: 0 }}>Your overall health condition is <strong>Excellent</strong>. Keep up the good habits!</p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, background: '#ede9fe', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Oxygen</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#7C3AED' }}>96%</div>
                </div>
                <div style={{ flex: 1, background: '#ede9fe', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Blood Pressure</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#7C3AED' }}>122/78</div>
                </div>
              </div>
            </div>

            {/* Heart Function */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#7C3AED' }}>❤️ Heart Function</h3>
              <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: Math.random() > 0.6 ? '#7C3AED' : '#c4b5fd',
                      borderRadius: '2px',
                      height: `${30 + Math.random() * 70}%`,
                      opacity: 0.8,
                    }}
                  />
                ))}
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>Heart rate appears stable with normal variations</div>
            </div>

            {/* AI Digital Twin Component */}
            {(analyzing || scanResult || error) && (
              <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                {error && (
                  <div style={{ padding: '1rem', background: '#7f1d1d', color: '#fecaca', textAlign: 'center' }}>⚠️ {error}</div>
                )}
                {!error && <DigitalTwin scanData={scanResult} isScanning={analyzing} />}
                
                {scanResult && !analyzing && (
                  <div style={{ padding: '1.5rem', background: '#1e293b', borderTop: '1px solid #334155' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#38bdf8', fontSize: '1.1rem' }}>AI Diagnostic Consensus</h4>
                    <p style={{ color: '#e2e8f0', margin: '0 0 1rem 0', fontStyle: 'italic' }}>"{scanResult.consensus}"</p>
                    <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px' }}>
                      <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '0.5rem' }}>Recommended Actions:</strong>
                      <ul style={{ color: '#cbd5e1', margin: 0, paddingLeft: '1.2rem' }}>
                        {scanResult.actions.map((act, i) => <li key={i}>{act}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Doctor Details */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#7C3AED' }}>👨‍⚕️ Your Doctors</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {doctors.map((doctor, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#7C3AED', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' }}>
                      {doctor.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>{doctor.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#999' }}>{doctor.specialty}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#666' }}>
                      <div>{doctor.date}</div>
                      {doctor.time && <div style={{ fontSize: '0.8rem', color: '#999' }}>{doctor.time}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ width: '32px', height: '32px', border: '1px solid #e5e7eb', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '1rem' }}>
                        📞
                      </button>
                      <button style={{ width: '32px', height: '32px', border: '1px solid #e5e7eb', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '1rem' }}>
                        💬
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Appointments */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#7C3AED' }}>📅 Upcoming Appointments</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {['Mon 18', 'Tue 19', 'Wed 20', 'Thu 21'].map((day, idx) => (
                  <div key={idx} style={{ padding: '1rem', textAlign: 'center', borderRadius: '8px', background: idx === 2 ? '#7C3AED' : '#f9f9f9', color: idx === 2 ? 'white' : '#333', cursor: 'pointer', transition: 'all 0.3s' }}>
                    <div style={{ fontWeight: 'bold' }}>{day}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#ede9fe', borderRadius: '8px', fontSize: '0.9rem', color: '#7C3AED' }}>
                ✓ Next appointment: Jan 20, 2026 at 2:30 PM with Dr. Sarah Chen
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
