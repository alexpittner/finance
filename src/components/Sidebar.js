import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from '../supabaseClient';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth'); // Redirect to the auth page after sign-out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/" end>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-employee">
              Add Employee
            </NavLink>
          </li>
          <li>
            <NavLink to="/scenarios">
              Scenarios
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-company">
              My Company
            </NavLink>
          </li>
          <li>
            <NavLink to="/manage-expense-categories">
              Manage Expense Categories
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports">
              Reports
            </NavLink>
          </li>
        </ul>
      </nav>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Sidebar;