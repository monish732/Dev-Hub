import React from 'react';

export default function HealthCard({ title, value, unit, severity, icon }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #d9e8fb',
      borderRadius: '16px',
      padding: '1.5rem 1.25rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <div style={{ fontSize: '0.75rem', color: '#5f7fa6', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600', marginBottom: '0.5rem' }}>{title}</div>
      <div style={{ fontSize: '2rem', color: '#2f77d6', fontWeight: '700', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: '#5f7fa6', marginTop: '0.3rem' }}>{unit}</div>
    </div>
  );
}