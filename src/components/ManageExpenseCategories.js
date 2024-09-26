import React, { useState, useEffect } from 'react';
import { supabase, fetchExpenseCategories, addExpenseCategory, updateExpenseCategory, deleteExpenseCategory } from '../supabaseClient';

function ManageExpenseCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const data = await fetchExpenseCategories(user.id);
        setCategories(data);
      }
    } catch (error) {
      setError('Error loading categories: ' + error.message);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await addExpenseCategory(user.id, newCategory);
        setNewCategory('');
        loadCategories();
      }
    } catch (error) {
      setError('Error adding category: ' + error.message);
    }
  };

  const handleUpdateCategory = async (id, newName) => {
    try {
      await updateExpenseCategory(id, newName);
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      setError('Error updating category: ' + error.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteExpenseCategory(id);
      loadCategories();
    } catch (error) {
      setError('Error deleting category: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Manage Expense Categories</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleAddCategory}>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          required
        />
        <button type="submit">Add Category</button>
      </form>

      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {editingCategory === category.id ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateCategory(category.id, e.target.name.value);
              }}>
                <input name="name" defaultValue={category.category_name} />
                <button type="submit">Save</button>
                <button onClick={() => setEditingCategory(null)}>Cancel</button>
              </form>
            ) : (
              <>
                {category.category_name}
                <button onClick={() => setEditingCategory(category.id)}>Edit</button>
                <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageExpenseCategories;