import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import AdminDashboard from './components/AdminDashboard';
import Simulator from './components/Simulator';

export default function App() {
  const [user, setUser] = useState(null);

  function handleLogin({ role, userId }) {
    setUser({ role, userId });
  }

  function handleLogout() {
    setUser(null);
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />

        <Route
          path="/admin"
          element={
            user?.role === 'admin' ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/doctor"
          element={
            user?.role === 'doctor' ? (
              <DoctorDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/patient"
          element={
            user?.role === 'patient' ? (
              <PatientDashboard userId={user.userId} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/patient/simulator"
          element={
            user?.role === 'patient' ? (
              <Simulator />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
