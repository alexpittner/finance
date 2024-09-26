import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fetch all expense categories for the current user
export async function fetchExpenseCategories(userId) {
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .eq('user_id', userId);
  
    if (error) {
      console.error('Error fetching categories:', error);
    }
  
    return data;
  }
  
  // Add a new expense category
  export async function addExpenseCategory(userId, categoryName) {
    const { data, error } = await supabase
      .from('expense_categories')
      .insert([{ user_id: userId, category_name: categoryName }]);
  
    if (error) {
      console.error('Error adding category:', error);
    }
  
    return data;
  }
  
  // Update an existing expense category
  export async function updateExpenseCategory(categoryId, categoryName) {
    const { data, error } = await supabase
      .from('expense_categories')
      .update({ category_name: categoryName })
      .eq('id', categoryId);
  
    if (error) {
      console.error('Error updating category:', error);
    }
  
    return data;
  }
  
  // Delete an expense category
  export async function deleteExpenseCategory(categoryId) {
    const { data, error } = await supabase
      .from('expense_categories')
      .delete()
      .eq('id', categoryId);
  
    if (error) {
      console.error('Error deleting category:', error);
    }
  
    return data;
  }
  
  // New functions
  export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  export const signUp = async (email, password, firstName, lastName) => {
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
    return data;
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

  export const addUserToTable = async (userId, email, firstName, lastName) => {
    console.log('Adding user to table:', userId, email, firstName, lastName);
    // This manual insertion is no longer needed
    // const { data, error } = await supabase
    //   .from('users')
    //   .insert([{ id: userId, email, first_name: firstName, last_name: lastName }]);
    // if (error) {
    //   console.error('Error adding user to table:', error);
    //   throw error;
    // }
    // console.log('User added to table:', data);
    // return data;
  };

  export const checkUserExists = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId);
  
    if (error) {
      console.error('Error checking user:', error);
      throw error;
    }
  
    return data && data.length > 0;
  };

  export const addCompany = async (companyData) => {
    const { data, error } = await supabase
      .from('companies')
      .insert([companyData]);
    if (error) throw error;
    return data;
  };

  export const getCompanies = async (userId) => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  };

  // Add this function to the existing file
  export const getScenarios = async (userId) => {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('company_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  };
