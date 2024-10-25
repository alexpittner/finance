import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../supabaseClient';
import './ProfileMenu.css';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="profile-menu">
      <button 
        className={`profile-button ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-user-circle"></i>
        {!isOpen && <span style={{marginLeft: '5px'}}>Profile</span>}
      </button>
      {isOpen && (
        <ul className="profile-dropdown">
          <li><button onClick={() => navigate('/dashboard/profile')}><i className="fas fa-user"></i> View Profile</button></li>
          <li><button onClick={() => navigate('/dashboard/settings')}><i className="fas fa-cog"></i> Settings</button></li>
          <li><button onClick={handleSignOut}><i className="fas fa-sign-out-alt"></i> Sign Out</button></li>
        </ul>
      )}
    </div>
  );
};

export default ProfileMenu;
