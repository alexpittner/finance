import React, { useState } from 'react';
import { updateUserProfile } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [companyStage, setCompanyStage] = useState('');
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleOnboarding = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await updateUserProfile({
        companyName,
        companyType,
        companyStage,
        userRole
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="onboarding">
      <h2>Tell us about your company</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleOnboarding}>
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <select
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
          required
        >
          <option value="">Select Company Type</option>
          <option value="startup">Startup</option>
          <option value="sme">SME</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <select
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
        <input
          type="text"
          placeholder="Your Role"
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          required
        />
        <button type="submit">Complete Onboarding</button>
      </form>
    </div>
  );
};

export default Onboarding;