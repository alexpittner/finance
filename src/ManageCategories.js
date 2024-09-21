import React, { useState, useEffect } from 'react';
import {
  fetchExpenseCategories,
  addExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory
} from './supabaseClient';

function ManageCategories({ userId }) {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // Holds the category being edited
  const [editedCategoryName, setEditedCategoryName] = useState('');

  useEffect(() => {
    async function loadCategories() {
      const data = await fetchExpenseCategories(userId);
      setCategories(data);
    }
    loadCategories();
  }, [userId]);

  // Add new category
  async function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    const newCategory = await addExpenseCategory(userId, newCategoryName);
    setCategories([...categories, ...newCategory]);
    setNewCategoryName('');
  }

  // Edit category
  async function handleEditCategory() {
    if (!editedCategoryName.trim()) return;
    await updateExpenseCategory(editingCategory.id, editedCategoryName);
    const updatedCategories = categories.map((cat) =>
      cat.id === editingCategory.id ? { ...cat, category_name: editedCategoryName } : cat
    );
    setCategories(updatedCategories);
    setEditingCategory(null);
    setEditedCategoryName('');
  }

  // Delete category
  async function handleDeleteCategory(categoryId) {
    await deleteExpenseCategory(categoryId);
    const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
    setCategories(updatedCategories);
  }

  return (
    <div>
      <h1>Manage Expense Categories</h1>

      {/* Add Category Form */}
      <input
        type="text"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        placeholder="New Category Name"
      />
      <button onClick={handleAddCategory}>Add Category</button>

      {/* List Categories */}
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {editingCategory?.id === category.id ? (
              <>
                <input
                  type="text"
                  value={editedCategoryName}
                  onChange={(e) => setEditedCategoryName(e.target.value)}
                />
                <button onClick={handleEditCategory}>Save</button>
                <button onClick={() => setEditingCategory(null)}>Cancel</button>
              </>
            ) : (
              <>
                {category.category_name}
                <button onClick={() => { setEditingCategory(category); setEditedCategoryName(category.category_name); }}>Edit</button>
                <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageCategories;
