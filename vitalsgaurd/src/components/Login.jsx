import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('patient');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!userId.trim()) return;
    onLogin({ role, userId });
    navigate(`/${role}`);
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <h1>VitalsGuard AI</h1>
        <p>Login as Hospital Admin, Doctor, or Patient</p>
        <form onSubmit={handleSubmit}>
          <label>
            Role
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="admin">Hospital Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </label>
          <label>
            Email/ID
            <input
              type="text"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="Type your login ID"
            />
          </label>
          <button type="submit">Login</button>
        </form>
      </section>
    </main>
  );
}
