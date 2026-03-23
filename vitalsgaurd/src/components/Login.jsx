import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Maps known usernames to roles
const userRoleMap = {
  'admin1':   'admin',
  'doctor1':  'doctor',
  'doctor2':  'doctor',
  'patient1': 'patient',
};

const demoAccounts = {
  doctor:  { username: 'doctor1',  password: 'doctor1' },
  patient: { username: 'patient1', password: 'patient1' },
  admin:   { username: 'admin1',   password: 'admin1' },
};

// ─── Shared input style ───────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '10px', border: '1px solid #ddd',
  borderRadius: '8px', marginBottom: '1.2rem', fontSize: '14px',
  fontFamily: 'inherit', boxSizing: 'border-box',
};

// ─── Shared button style ──────────────────────────────────────────────────────
const primaryBtn = (loading) => ({
  width: '100%', padding: '10px', border: 'none', borderRadius: '8px',
  color: 'white', background: '#7C3AED', fontWeight: '700',
  cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px',
  marginBottom: '20px', opacity: loading ? 0.7 : 1, transition: 'all 0.3s',
});

export default function Login({ onLogin }) {
  const [action, setAction]     = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('patient');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [notice, setNotice]     = useState('');
  const navigate = useNavigate();

  // Auto-detect role from well-known usernames
  useEffect(() => {
    const mapped = userRoleMap[username.toLowerCase()];
    if (mapped) setRole(mapped);
    else if (action === 'login') setRole('patient');
  }, [username, action]);

  async function handleAuthSubmit(e) {
    if (e) e.preventDefault();
    setError(''); setNotice(''); setLoading(true);

    try {
      const lowerUsername = username.toLowerCase();

      // Ensure they don't try to sign up with a known demo account name
      if (action === 'signup' && userRoleMap[lowerUsername]) {
        throw new Error('This username is reserved. Please choose another.');
      }

      // Call the Node.js Auth Server
      const response = await axios.post('http://localhost:5003/auth', {
        username: lowerUsername,
        password,
        action,
      });

      if (response.data.success) {
        if (action === 'signup') {
          // Instantly log them in after signup as requested
          const userRole = role || 'patient';
          onLogin({ role: userRole, userId: response.data.userId, username: lowerUsername });
          navigate(`/${userRole}`);
        } else {
          // Login
          const userRole = userRoleMap[lowerUsername] || 'patient';
          onLogin({ role: userRole, userId: response.data.userId, username: lowerUsername });
          navigate(`/${userRole}`);
        }
      } else {
        throw new Error(response.data.message || 'Authentication failed.');
      }
    } catch (err) {
      if (err.message === 'Network Error') {
         setError('Cannot connect to Auth Server (Port 5003). Falling back to demo mode is possible.');
      } else {
         setError(err.response?.data?.message || err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Quick demo login (Bypasses server if it is offline) ────────────────────
  async function quickLogin(demoRole) {
    setError(''); setNotice(''); setLoading(true);
    const acc = demoAccounts[demoRole];
    setUsername(acc.username);
    setPassword(acc.password);

    try {
      const response = await axios.post('http://localhost:5003/auth', {
        username: acc.username,
        password: acc.password,
        action: 'login',
      });

      if (response.data.success) {
        onLogin({ role: demoRole, userId: response.data.userId, username: acc.username });
        navigate(`/${demoRole}`);
      } else {
        throw new Error('Invalid demo credentials on server.');
      }
    } catch {
      // Offline fallback: log in locally anyway
      onLogin({ role: demoRole, userId: `demo-${demoRole}`, username: acc.username });
      navigate(`/${demoRole}`);
    } finally {
      setLoading(false);
    }
  }

  const isSignUp = action === 'signup';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Left Panel ──────────────────────────── */}
      <div style={{
        width: '40%', background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        color: 'white', padding: '60px 40px', display: 'flex',
        flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 28, marginBottom: 8 }}>💊</div>
          <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 'bold' }}>VitalsGuard</h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>CLINICAL HEALTH AI</p>
        </div>

        <div>
          <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 20, lineHeight: 1.2 }}>
            Smarter health monitoring for every patient.
          </h2>
          <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 40 }}>
            AI-powered vital sign tracking, real-time alerts, and clinical-grade management — all in one platform.
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {[
              ['⚡', 'AI-powered real-time vitals monitoring'],
              ['🏥', 'Clinical-grade health protocols built-in'],
              ['🔐', 'Role-based access for your entire team'],
            ].map(([icon, text]) => (
              <li key={text} style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20, fontSize: 14 }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>© 2026 VitalsGuard. All rights reserved.</p>
      </div>

      {/* ── Right Panel ──────────────────────────── */}
      <div style={{
        width: '60%', padding: '60px 40px', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        background: '#f5f3ff',
      }}>
        <div style={{ width: 'min(400px, 100%)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 50, height: 50, background: '#7C3AED', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>
              💊
            </div>
            <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 'bold', color: '#1f2937' }}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: '#999' }}>
              {isSignUp ? 'Sign up for VitalsGuard' : 'Sign in to VitalsGuard — Continue your journey'}
            </p>
          </div>

          {/* Error / Notice banners */}
          {error && (
            <div style={{ color: '#dc2626', marginBottom: '1rem', padding: 12, backgroundColor: '#fee2e2', borderRadius: 8, fontSize: 13, border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}
          {notice && (
            <div style={{ color: '#065f46', marginBottom: '1rem', padding: 12, backgroundColor: '#d1fae5', borderRadius: 8, fontSize: 13, border: '1px solid #a7f3d0' }}>
              {notice}
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleAuthSubmit}>
            <label style={{ display: 'block', marginBottom: 8, color: '#333', fontWeight: 600, fontSize: 14 }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={isSignUp ? "Choose a username" : "Enter your username"}
              style={inputStyle}
              required
            />

            {isSignUp && (
              <>
                <label style={{ display: 'block', marginBottom: 8, color: '#333', fontWeight: 600, fontSize: 14 }}>
                  Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </>
            )}

            <label style={{ display: 'block', marginBottom: 8, color: '#333', fontWeight: 600, fontSize: 14 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...inputStyle, marginBottom: '1.5rem' }}
              required
            />

            <button
              type="submit"
              disabled={loading}
              style={primaryBtn(loading)}
              onMouseEnter={e => !loading && (e.target.style.background = '#6D28D9')}
              onMouseLeave={e => (e.target.style.background = '#7C3AED')}
            >
              {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Toggle login / signup */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: '#666' }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button
              onClick={() => { setAction(isSignUp ? 'login' : 'signup'); setError(''); setNotice(''); }}
              style={{ background: 'none', border: 'none', color: '#7C3AED', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
            >
              {isSignUp ? 'Sign In' : 'Create one'}
            </button>
          </div>

          {/* Demo quick-login buttons (login screen only) */}
          {!isSignUp && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Demo accounts</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                {['doctor', 'patient'].map(r => (
                  <button
                    key={r}
                    onClick={() => quickLogin(r)}
                    disabled={loading}
                    style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, color: '#7C3AED', fontWeight: 500, transition: 'all 0.3s' }}
                    onMouseEnter={e => !loading && Object.assign(e.target.style, { borderColor: '#7C3AED', background: '#f5f3ff' })}
                    onMouseLeave={e => Object.assign(e.target.style, { borderColor: '#e5e7eb', background: '#fff' })}
                  >
                    {r === 'doctor' ? '👨‍⚕️ Doctor' : '👤 Patient'}
                  </button>
                ))}
              </div>
              <button
                onClick={() => quickLogin('admin')}
                disabled={loading}
                style={{ width: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, color: '#7C3AED', fontWeight: 500, transition: 'all 0.3s' }}
                onMouseEnter={e => !loading && Object.assign(e.target.style, { borderColor: '#7C3AED', background: '#f5f3ff' })}
                onMouseLeave={e => Object.assign(e.target.style, { borderColor: '#e5e7eb', background: '#fff' })}
              >
                🛡️ Admin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
