import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpConfirmation.css';

const SignUpConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-confirmation">
      <h2>Check your email to confirm your signup</h2>
      <p>We've sent you an email with a confirmation link. Please check your inbox and click the link to complete your registration.</p>
      <button className="login-button" onClick={() => navigate('/auth')}>
        Go to Login
      </button>
    </div>
  );
};

export default SignUpConfirmation;
