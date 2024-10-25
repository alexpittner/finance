import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // We'll create this CSS file next

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        {isOpen && <h2>Dashboard</h2>}
        <button onClick={toggleSidebar} className="toggle-sidebar">
          {isOpen ? '◀' : '▶'}
        </button>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard" end title="Dashboard">
            <i className="fas fa-home"></i>
            {isOpen && <span>Dashboard</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/income" title="Income">
            <i className="fas fa-money-bill-wave"></i>
            {isOpen && <span>Income</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/expenses" title="Expenses">
            <i className="fas fa-receipt"></i>
            {isOpen && <span>Expenses</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/funding" title="Funding">
            <i className="fas fa-piggy-bank"></i>
            {isOpen && <span>Funding</span>}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
