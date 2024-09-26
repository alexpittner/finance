import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function AddEmployee() {
  const [employee, setEmployee] = useState({
    title: '',
    start_date: '',
    end_date: '',
    company_id: '', // You might want to get this from context or props
    scenario_id: '', // You might want to get this from context or props
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('projected_employees')
        .insert([employee]);

      if (error) throw error;
      
      console.log('Employee added successfully:', data);
      // Reset form or redirect user
      setEmployee({
        title: '',
        start_date: '',
        end_date: '',
        company_id: '',
        scenario_id: '',
      });
    } catch (error) {
      console.error('Error adding employee:', error.message);
    }
  };

  return (
    <div>
      <h1>Add Projected Employee</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={employee.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="start_date">Start Date:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={employee.start_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="end_date">End Date:</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={employee.end_date}
            onChange={handleChange}
          />
        </div>
        {/* You might want to add dropdowns for company_id and scenario_id */}
        <button type="submit">Add Projected Employee</button>
      </form>
    </div>
  );
}

export default AddEmployee;
