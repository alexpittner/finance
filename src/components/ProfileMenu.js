import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    console.log('Signing out...');
    navigate('/auth');
  };

  return (
    <div className="profile-menu">
      <ul>
        <li><button onClick={() => navigate('/dashboard/profile')}><i className="fas fa-user"></i> Profile</button></li>
        <li><button onClick={() => navigate('/dashboard/settings')}><i className="fas fa-cog"></i> Settings</button></li>
        <li><button onClick={handleSignOut}><i className="fas fa-sign-out-alt"></i> Sign Out</button></li>
      </ul>
    </div>
  );
};

export default ProfileMenu;