import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getCurrentUser } from './supabaseClient';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProfileMenu from './components/ProfileMenu';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    }
    loadUser();
  }, []);

  const handleAuthComplete = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <AuthPage onAuthComplete={handleAuthComplete} />;
  }

  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <div className="header">
            <ProfileMenu user={user} onSignOut={handleSignOut} />
          </div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
