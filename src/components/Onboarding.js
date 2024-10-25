import React, { useState, useEffect } from 'react';
import { createOrganization, checkOnboardingStatus } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

const Onboarding = () => {
  useEffect(() => {
    console.log('Onboarding component mounted');
  }, []);

  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [companyStage, setCompanyStage] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleOnboarding = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      console.log('Submitting onboarding data:', { companyName, companyType, companyStage });
      await createOrganization({
        name: companyName,
        type: companyType,
        stage: companyStage
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error during onboarding:', err);
      if (err.message === 'User already has an organization') {
        // The user already has an organization, so we can consider them onboarded
        navigate('/dashboard');
      } else {
        setError(err.message || 'An error occurred during onboarding');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="onboarding-container" style={{backgroundColor: 'lightblue', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div className="onboarding-form" style={{backgroundColor: 'white', padding: '20px', borderRadius: '8px'}}>
        <h2>Onboarding Form</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleOnboarding}>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyType">Company Type</label>
            <select
              id="companyType"
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              required
            >
              <option value="">Select Company Type</option>
              <option value="startup">Startup</option>
              <option value="sme">SME</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="companyStage">Company Stage</label>
            <select
              id="companyStage"
              value={companyStage}
              onChange={(e) => setCompanyStage(e.target.value)}
              required
            >
              <option value="">Select Company Stage</option>
              <option value="idea">Idea</option>
              <option value="mvp">MVP</option>
              <option value="growth">Growth</option>
              <option value="scale">Scale</option>
            </select>
          </div>
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Complete Onboarding'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
