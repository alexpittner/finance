import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signUp = async (email, password, firstName, lastName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });
    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, is_onboarded: false })
        .single();
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
        // You might want to handle this error differently
      }
    }

    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const updateUserProfile = async (profileData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user logged in');

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      ...profileData
    }, { onConflict: 'id' });

  if (error) throw error;
  return data;
};

export const createOrganization = async (organizationData) => {
  console.log('Creating organization:', organizationData);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user logged in');

  try {
    // First, check if the user already has an organization
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    if (existingProfile && existingProfile.organization_id) {
      throw new Error('User already has an organization');
    }

    // If the user doesn't have an organization, create a new one
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .insert([organizationData])
      .select();

    if (orgError) {
      console.error('Error creating organization:', orgError);
      throw orgError;
    }

    if (!organization || organization.length === 0) {
      throw new Error('Organization was not created');
    }

    console.log('Organization created:', organization[0]);

    // Update the user's profile with the new organization_id
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({ 
        organization_id: organization[0].id,
        is_onboarded: true
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw updateError;
    }

    console.log('Profile updated with organization:', profile);
    return { organization: organization[0], profile };
  } catch (error) {
    console.error('Error in createOrganization:', error);
    throw error;
  }
};

export const checkOnboardingStatus = async () => {
  console.log('Starting onboarding status check...');
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('Auth getUser result:', user, userError);
    if (userError) throw userError;
    if (!user) {
      console.log('No user logged in');
      return false;
    }

    console.log('Fetching profile for user:', user.id);
    const { data, error } = await supabase
      .from('profiles')
      .select('is_onboarded')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return false;
    }
    
    if (!data) {
      console.log('Profile not found');
      return false;
    }
    
    console.log('Profile data:', data);
    const isOnboarded = data.is_onboarded ?? false;
    console.log('Is onboarded:', isOnboarded);
    return isOnboarded;
  } catch (error) {
    console.error('Error in checkOnboardingStatus:', error);
    return false;
  }
};
