import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../supabaseClient';

const ProfileMenu = ({ onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      onSignOut();
      navigate('/auth'); // Redirect to the auth page after sign-out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="profile-menu">
      <div className="profile-icon" onClick={() => setIsOpen(!isOpen)}>
        <img src="/path/to/profile-icon.png" alt="Profile" />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;