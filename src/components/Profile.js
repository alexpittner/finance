import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [orgStage, setOrgStage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editOrgMode, setEditOrgMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    fetchProfileAndOrganization();
  }, []);

  async function fetchProfileAndOrganization() {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (user) {
        setUser(user);  // Make sure this line is present
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id);

        if (profileError) throw profileError;

        if (profileData && profileData.length > 0) {
          const profile = profileData[0];
          console.log('Fetched profile:', profile);

          setProfile(profile);
          setFirstName(profile.first_name || '');
          setLastName(profile.last_name || '');

          if (profile.organization_id) {
            const { data: orgData, error: orgError } = await supabase
              .from('organizations')
              .select('*')
              .eq('id', profile.organization_id);

            if (orgError) throw orgError;

            if (orgData && orgData.length > 0) {
              const organization = orgData[0];
              console.log('Fetched organization:', organization);
              setOrganization(organization);
            } else {
              console.log('No organization found for the given ID');
              setOrganization(null);
            }
          } else {
            setOrganization(null);
          }
        } else {
          console.log('No profile found for the user');
          setProfile(null);
          setOrganization(null);
        }
      } else {
        throw new Error('No authenticated user found');
      }
    } catch (error) {
      console.error('Error fetching profile or organization:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ first_name: firstName, last_name: lastName })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setEditMode(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function createOrganization(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // Check if user exists
      if (!user) {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        console.log('Current user:', user);
        if (userError) throw userError;
        if (!currentUser) throw new Error('No authenticated user found');
        setUser(currentUser);
      }

      // Insert the new organization
      const { data: newOrg, error: insertError } = await supabase
        .from('organizations')
        .insert([{ name: orgName}, {type: orgType}, {stage: orgStage }])
        .select();

      if (insertError) throw insertError;

      console.log('Organization created:', newOrg);

      // Update the user's profile with the new organization ID
      const { data: updatedProfile, error: profileError } = await supabase
        .from('profiles')
        .update({ organization_id: newOrg.id })
        .eq('id', user.id)
        .select()
        .single();

      if (profileError) throw profileError;

      console.log('Profile updated:', updatedProfile);

      setOrganization(newOrg);
      setProfile(updatedProfile);
      setShowOrgForm(false);
    } catch (error) {
      console.error('Error creating organization or updating profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrganization(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update({ name: orgName, type: orgType, stage: orgStage })
        .eq('id', organization.id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        console.log('Organization updated:', data[0]);
        setOrganization(data[0]);
        setEditOrgMode(false);
      } else {
        throw new Error('Failed to update organization');
      }
    } catch (error) {
      console.error('Error updating organization:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No authenticated user found.</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-info">
        <p><strong>Email:</strong> {user.email}</p>
        {editMode ? (
          <form onSubmit={updateProfile}>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          </form>
        ) : (
          <>
            <p><strong>First Name:</strong> {profile.first_name || 'N/A'}</p>
            <p><strong>Last Name:</strong> {profile.last_name || 'N/A'}</p>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}
      </div>

      <h2>Organization Information</h2>
      <div className="organization-info">
        {organization ? (
          editOrgMode ? (
            <form onSubmit={updateOrganization} className="org-form">
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Organization Name"
                required
              />
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                required
              >
                <option value="">Select Company Type</option>
                <option value="startup">Startup</option>
                <option value="sme">SME</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <select
                value={orgStage}
                onChange={(e) => setOrgStage(e.target.value)}
                required
              >
                <option value="">Select Company Stage</option>
                <option value="idea">Idea</option>
                <option value="mvp">MVP</option>
                <option value="growth">Growth</option>
                <option value="scale">Scale</option>
              </select>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setEditOrgMode(false)}>Cancel</button>
            </form>
          ) : (
            <>
              <p><strong>Organization Name:</strong> {organization.name}</p>
              <p><strong>Organization Type:</strong> {organization.type}</p>
              <p><strong>Organization Stage:</strong> {organization.stage}</p>
              <button onClick={() => {
                setOrgName(organization.name);
                setOrgType(organization.type);
                setOrgStage(organization.stage);
                setEditOrgMode(true);
              }}>Edit Organization</button>
            </>
          )
        ) : showOrgForm ? (
          <form onSubmit={createOrganization} className="org-form">
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Organization Name"
              required
            />
            <select
              value={orgType}
              onChange={(e) => setOrgType(e.target.value)}
              required
            >
              <option value="">Select Company Type</option>
              <option value="startup">Startup</option>
              <option value="sme">SME</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <select
              value={orgStage}
              onChange={(e) => setOrgStage(e.target.value)}
              required
            >
              <option value="">Select Company Stage</option>
              <option value="idea">Idea</option>
              <option value="mvp">MVP</option>
              <option value="growth">Growth</option>
              <option value="scale">Scale</option>
            </select>
            <button type="submit">Save Organization</button>
            <button type="button" onClick={() => setShowOrgForm(false)}>Cancel</button>
          </form>
        ) : (
          <>
            <p>No organization information found.</p>
            <button onClick={() => setShowOrgForm(true)}>Create Organization</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
