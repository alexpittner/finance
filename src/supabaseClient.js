// src/supabaseClient.js
import {createClient} from '@supabase/supabase-js'

// Your Supabase credentials
const supabaseUrl = 'https://gxzfhunjtdywnxmcgmdh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4emZodW5qdGR5d254bWNnbWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYxNTUxMDIsImV4cCI6MjAzMTczMTEwMn0.sxLVaPpm_TjT3W0EE0qDSEq22j37iXKZiWH-PKDV6R0'

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
  