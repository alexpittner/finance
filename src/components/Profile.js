import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        console.log('Auth user:', user);

        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id);

          if (error) throw error;

          console.log('Profile data:', data);

          if (data && data.length > 0) {
            setUser(user);
            setProfile(data[0]);
          } else {
            throw new Error('No profile data found');
          }
        } else {
          throw new Error('No authenticated user found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user || !profile) {
    return <div>Unable to load profile information. User: {JSON.stringify(user)}, Profile: {JSON.stringify(profile)}</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-info">
        <p><strong>First Name:</strong> {profile.first_name || 'N/A'}</p>
        <p><strong>Last Name:</strong> {profile.last_name || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
