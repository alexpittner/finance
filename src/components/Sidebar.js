import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button onClick={toggleSidebar} className="close-sidebar">
        <i className="fas fa-times"></i>
      </button>
      <ul>
        <li><NavLink to="/dashboard" end><i className="fas fa-home"></i> Dashboard</NavLink></li>
        <li><NavLink to="/dashboard/profile"><i className="fas fa-user"></i> Profile</NavLink></li>
        <li><NavLink to="/dashboard/settings"><i className="fas fa-cog"></i> Settings</NavLink></li>
      </ul>
    </nav>
  );
};

export default Sidebar;