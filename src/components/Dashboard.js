import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProfileMenu from './ProfileMenu';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/dashboard/profile':
        return 'Profile';
      case '/dashboard/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="dashboard">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`dashboard-content ${isSidebarOpen ? '' : 'expanded'}`}>
        <header className="dashboard-header">
          <div className="header-left">
            <button onClick={toggleSidebar} className="sidebar-toggle">
              <i className={`fas fa-${isSidebarOpen ? 'times' : 'bars'}`}></i>
            </button>
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>
          <div className="profile-area">
            <span className="user-name">John Doe</span>
            <div className="profile-circle" onClick={toggleProfileMenu}>
              JD
            </div>
            {isProfileMenuOpen && <ProfileMenu />}
          </div>
        </header>
        <main className="dashboard-main">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const DashboardHome = () => (
  <div className="dashboard-home">
    <h2>Welcome to your Dashboard</h2>
    <div className="dashboard-cards">
      <div className="card">
        <h3>Total Users</h3>
        <p className="card-value">1,234</p>
      </div>
      <div className="card">
        <h3>Revenue</h3>
        <p className="card-value">$5,678</p>
      </div>
      <div className="card">
        <h3>Active Projects</h3>
        <p className="card-value">42</p>
      </div>
    </div>
  </div>
);

const ProfilePage = () => (
  <div className="profile-page">
    <h2>Your Profile</h2>
    <p>Manage your account settings and preferences here.</p>
  </div>
);

const SettingsPage = () => (
  <div className="settings-page">
    <h2>Settings</h2>
    <p>Customize your dashboard experience.</p>
  </div>
);

export default Dashboard;