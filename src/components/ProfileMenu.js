import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../supabaseClient';

const ProfileMenu = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User object:', user);
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      onSignOut();
      navigate('/auth'); // Redirect to the auth page after sign-out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const displayName = fullName || user?.email || 'User';

  return (
    <div className="profile-menu">
      <span className="user-name">{displayName}</span>
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