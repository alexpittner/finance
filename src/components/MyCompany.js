import React, { useState, useEffect } from 'react';
import { supabase, getCurrentUser, checkUserExists, addCompany, getCompanies } from '../supabaseClient';

const MyCompany = () => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchUserAndCompany = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const companies = await getCompanies(currentUser.id);
        if (companies && companies.length > 0) {
          setCompany(companies[0]);
        }
      }
    };
    fetchUserAndCompany();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!user) {
        setError('User not logged in.');
        return;
      }

      const userExists = await checkUserExists(user.id);
      if (!userExists) {
        setError('User does not exist in the database.');
        return;
      }

      const companyData = {
        user_id: user.id,
        name: name,
        industry: industry,
        type: type,
        start_date: startDate
      };

      const result = await addCompany(companyData);
      console.log('Company add result:', result);

      setSuccess('Company added successfully!');
      setCompany(result[0]);
      setName('');
      setIndustry('');
      setType('');
      setStartDate('');

    } catch (err) {
      console.error('Detailed error:', err);
      setError('Error adding company: ' + err.message);
    }
  };

  return (
    <div>
      <h2>My Company</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {company ? (
        <div>
          <h3>{company.name}</h3>
          <p>Industry: {company.industry}</p>
          <p>Type: {company.type}</p>
          <p>Start Date: {company.start_date}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Company Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Industry:</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">Select Type</option>
              <option value="SaaS">SaaS</option>
              <option value="e-commerce">e-commerce</option>
              <option value="digital product">Digital Product</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <button type="submit">Add Company</button>
        </form>
      )}
    </div>
  );
};

export default MyCompany;