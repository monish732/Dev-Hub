import React from 'react';
import { patients } from '../data/mockVitals';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

export default function AdminDashboard({ onLogout }) {
  const counts = patients.reduce(
    (acc, patient) => {
      acc[patient.vitals[patient.vitals.length - 1].status] += 1;
      return acc;
    },
    { stable: 0, warning: 0, critical: 0 }
  );

  const chartData = [
    { name: 'Stable', value: counts.stable },
    { name: 'Warning', value: counts.warning },
    { name: 'Critical', value: counts.critical }
  ];

  return (
    <div className="dashboard admin-mode">
      <header>
        <h1>Hospital Admin</h1>
        <div className="header-actions">
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="card">
        <h2>Platform KPI</h2>
        <p>Active Patients: {patients.length}</p>
        <p>Critical Alerts: {counts.critical}</p>
        <p>Warnings: {counts.warning}</p>
      </div>

      <div className="chart-area">
        <h3>Live Patient Status Distribution</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie dataKey="value" data={chartData} cx="50%" cy="50%" outerRadius={80} label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3>Incoming AI Analytics</h3>
        <ul>
          <li>Micro-pattern detection engine processed last hour data.</li>
          <li>3 patients show cardiac signature match in ‘health anomaly fingerprint’.</li>
          <li>Auto escape: smart alert auto-sent to emergency contact for 1 user.</li>
        </ul>
      </div>
      <div className="action-row">
        <Link className="button" to="/admin/policy">Manage Access / Token Marketplace</Link>
      </div>
    </div>
  );
}
