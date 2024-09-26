import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function AddScenario() {
  const [scenario, setScenario] = useState({
    name: '',
    assumptions: '',
    company_id: '',
  });
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const { data, error } = await supabase.from('companies').select('id, name');
    if (error) {
      console.error('Error fetching companies:', error);
    } else {
      setCompanies(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScenario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .insert([scenario]);

      if (error) throw error;
      
      setMessage('Scenario added successfully!');
      console.log('Scenario added:', data);
      // Reset form
      setScenario({
        name: '',
        assumptions: '',
        company_id: '',
      });
    } catch (error) {
      setMessage(`Error adding scenario: ${error.message}`);
      console.error('Error adding scenario:', error.message);
    }
  };

  return (
    <div>
      <h1>Add Scenario</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={scenario.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="assumptions">Assumptions:</label>
          <textarea
            id="assumptions"
            name="assumptions"
            value={scenario.assumptions}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="company_id">Company:</label>
          <select
            id="company_id"
            name="company_id"
            value={scenario.company_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a company</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        </div>
        <button type="submit">Add Scenario</button>
      </form>
    </div>
  );
}

export default AddScenario;