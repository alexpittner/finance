import React, { useState } from 'react';
import { signUp, signIn } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css'; // We'll create this CSS file next

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        await signUp(email, password, firstName, lastName);
        navigate('/signup-confirmation');
      } else {
        await signIn(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2 className="auth-title">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="auth-input"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="auth-input"
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        <p className="auth-switch">
          {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="auth-switch-button">
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
