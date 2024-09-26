import React, { useState, useEffect } from 'react';
import { supabase, getCurrentUser, checkUserExists, addCompany } from '../supabaseClient';

const AddCompany = () => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      console.log('Fetched user:', currentUser);
      if (currentUser) {
        const exists = await checkUserExists(currentUser.id);
        console.log('User exists in database:', exists);
      }
      setUser(currentUser);
    };
    fetchUser();
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

      console.log('Attempting to add company with user_id:', user.id);

      const userExists = await checkUserExists(user.id);
      console.log('User exists:', userExists);
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
      <h2>Add Company</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

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
    </div>
  );
};

export default AddCompany;
