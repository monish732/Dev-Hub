import React from 'react';

const labelMap = { stable: '🟢 Stable', warning: '🟠 Warning', critical: '🔴 Critical' };

export default function HealthCard({ title, value, unit, severity, icon }) {
  return (
    <div className={`health-card ${severity || 'stable'}`}>
      <div className="health-icon">{icon}</div>
      <div className="health-detail">
        <strong>{title}</strong>
        <span>{value}{unit}</span>
      </div>
      {severity && <div className="health-status">{labelMap[severity] || labelMap.stable}</div>}
    </div>
  );
}
