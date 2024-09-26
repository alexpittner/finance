import React, { useState, useEffect } from 'react';
import { getCurrentUser } from './supabaseClient';
import Onboarding from './components/Onboarding';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddEmployee from './components/AddEmployee';
import Scenarios from './components/Scenarios';
import MyCompany from './components/MyCompany';
import ManageExpenseCategories from './components/ManageExpenseCategories';
import Reports from './components/Reports';
import Auth from './components/Auth';
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

  const handleOnboardingComplete = () => {
    // Reload the user data after onboarding
    getCurrentUser().then(setUser);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Router>
      <div className="app">
        {user ? (
          <>
            <Sidebar />
            <div className="content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add-employee" element={<AddEmployee />} />
                <Route path="/scenarios" element={<Scenarios />} />
                <Route path="/my-company" element={<MyCompany />} />
                <Route path="/manage-expense-categories" element={<ManageExpenseCategories />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/auth" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
