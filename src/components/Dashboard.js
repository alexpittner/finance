import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProfileMenu from './ProfileMenu';
import Income from './Income';
import Expenses from './Expenses';
import Funding from './Funding';
import Profile from './Profile';
import './Dashboard.css'; // We'll create this CSS file next

// Placeholder component for dashboard home
const DashboardHome = () => <h2>Dashboard Home</h2>;

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`dashboard-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <header className="dashboard-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className={`fas fa-${isSidebarOpen ? 'times' : 'bars'}`}></i>
          </button>
          <div className="profile-menu-container">
            <ProfileMenu />
          </div>
        </header>
        <main className="dashboard-main">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="income" element={<Income />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="funding" element={<Funding />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
