import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Onboarding from './components/Onboarding';
import SignUpConfirmation from './components/SignUpConfirmation';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session:', session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      if (authListener && authListener.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AppRoutes user={user} />
    </Router>
  );
}

function AppRoutes({ user }) {
  const location = useLocation();

  console.log('AppRoutes render - User:', user);

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      <Route path="/signup-confirmation" element={<SignUpConfirmation />} />
      <Route 
        path="/onboarding" 
        element={
          user 
            ? <Onboarding />
            : <Navigate to="/auth" state={{ from: location }} replace />
        } 
      />
      <Route 
        path="/dashboard/*" 
        element={
          user
            ? <Dashboard />
            : <Navigate to="/auth" state={{ from: location }} replace />
        } 
      />
      <Route 
        path="/" 
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/auth" replace />
        } 
      />
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
