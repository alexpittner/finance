import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
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
    </div>
  );
};

export default Sidebar;