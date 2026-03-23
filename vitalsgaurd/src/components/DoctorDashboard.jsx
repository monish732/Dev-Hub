import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HealthCard from './HealthCard';
import CriticalOverlay from './CriticalOverlay';
import { patients } from '../data/mockVitals';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export default function DoctorDashboard({ onLogout }) {
	const [activePatient, setActivePatient] = useState(patients[0]);
	const [mode, setMode] = useState('normal');
	const [analyzing, setAnalyzing] = useState(false);
	const [scanResult, setScanResult] = useState(null);

	function examineVitals(patient) {
		setActivePatient(patient);
		setScanResult(null);
	}

	const latest = activePatient.vitals[activePatient.vitals.length - 1];
	const summary = {
		hr: latest.hr,
		spo2: latest.spo2,
		temp: latest.temp,
		status: latest.status,
	};

	async function runDoctorAnalysis() {
		setAnalyzing(true);
		setScanResult(null);
		try {
			const res = await axios.post(`${API_BASE}/analyze-vitals`, {
				heart_rate: latest.hr,
				spo2: latest.spo2,
				temperature: latest.temp,
				ecg_irregularity: (activePatient.id === 'p2' ? 0.72 : 0.0)
			});
			setScanResult(res.data);
		} catch (error) {
			console.error("Backend error:", error);
			alert("Failed to connect to AI Backend.");
		} finally {
			setAnalyzing(false);
		}
	}

	async function handleEmergencyAlert() {
		if (scanResult?.emergency?.dispatch_alert) {
			alert(`Auto-Emergency alert triggered! Reason: ${scanResult.emergency.urgency_note}`);
		} else {
			alert('Emergency alert sent manually.');
		}
	}

	return (
		<div className={`dashboard ${mode}`}>
			<CriticalOverlay
				active={mode === 'critical'}
				message="Patient critical parameter detected. Auto alert ready for emergency contact."
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
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<h2>{activePatient.name} - Real Time Vital Model</h2>
						<button 
							onClick={runDoctorAnalysis} 
							disabled={analyzing}
							style={{ padding: '0.6rem 1.2rem', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', cursor: analyzing ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
						>
							{analyzing ? 'Scanning Patient...' : 'Run Phidata Agent Scan ✨'}
						</button>
					</div>
					<div className="health-grid">
						<HealthCard title="Heart Rate" value={summary.hr} unit=" BPM" severity={summary.status} icon="❤️" />
						<HealthCard title="SpO2" value={summary.spo2} unit=" %" severity={summary.status} icon="🩸" />
						<HealthCard title="Temperature" value={summary.temp} unit=" °C" severity={summary.status} icon="🌡️" />
					</div>

					{scanResult && (
						<div className="trend-box" style={{ background: '#0f172a', border: '1px solid #334155' }}>
							<h3 style={{ color: '#38bdf8' }}>AI Risk Signature & Fingerprints</h3>
							<p style={{ color: '#cbd5e1' }}>
								EWS Score: <strong>{scanResult.ews.score} ({scanResult.ews.level})</strong>. 
								Silent Risk Confidence: <strong>{Math.round(scanResult.lstm_result.confidence * 100)}%</strong>.
							</p>
							<div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
								{scanResult.fingerprints.map(fp => (
									<span key={fp.disease} style={{ background: '#1e293b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#f8fafc', border: '1px solid #475569' }}>
										{fp.disease.replace(/_/g, ' ')}
									</span>
								))}
							</div>
						</div>
					)}

					<div className="chart-area">
						<ResponsiveContainer width="100%" height={270}>
							<LineChart data={activePatient.vitals}>
								<XAxis dataKey="time" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line type="monotone" dataKey="hr" stroke="#e85252" strokeWidth={2} name="Heart Rate" />
								<Line type="monotone" dataKey="spo2" stroke="#2f9eea" strokeWidth={2} name="SpO2" />
								<Line type="monotone" dataKey="temp" stroke="#f9a825" strokeWidth={2} name="Temp" />
							</LineChart>
						</ResponsiveContainer>
					</div>

					{scanResult && (
						<div className="ai-debate" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1rem' }}>
							<h3 style={{ color: '#c084fc', marginBottom: '1rem' }}>AI Debate (Monitoring vs Diagnosis)</h3>
							
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
								<div style={{ background: '#0f172a', padding: '0.8rem', borderRadius: '8px' }}>
									<strong style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Monitoring Report</strong>
									<p style={{ color: '#e2e8f0', fontSize: '0.9rem', marginTop: '0.4rem' }}>{scanResult.debate.monitoring_view}</p>
								</div>
								<div style={{ background: '#0f172a', padding: '0.8rem', borderRadius: '8px' }}>
									<strong style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Diagnosis Report</strong>
									<p style={{ color: '#e2e8f0', fontSize: '0.9rem', marginTop: '0.4rem' }}>{scanResult.debate.diagnosis_view}</p>
								</div>
							</div>

							<p style={{ color: '#f8fafc', fontSize: '1rem', fontStyle: 'italic', borderLeft: '4px solid #c084fc', paddingLeft: '1rem' }}>
								{scanResult.consensus}
							</p>
							
							<div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}>
								Disagreement Score: <strong>{scanResult.disagreement_score}/10</strong> | 
								Emergency Override: <strong style={{ color: scanResult.emergency.dispatch_alert ? '#ef4444' : '#22c55e' }}>
									{scanResult.emergency.dispatch_alert ? 'YES' : 'NO'}
								</strong>
							</div>
						</div>
					)}

					<div className="action-row">
						<button onClick={handleEmergencyAlert}>Send Alert</button>
					</div>
				</div>
			</section>
		</div>
	);
}
