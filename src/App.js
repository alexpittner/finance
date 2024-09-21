// src/App.js
import React from 'react';
import ManageCategories from './ManageCategories';

function App() {
  const userId = 'e5831622-2b0b-46ef-b376-b3e304046283'; // This will likely come from Auth0 or Supabase auth

  return (
    <div className="App">
      <h1>Expense Management</h1>
      <ManageCategories userId={userId} />
    </div>
  );
}

export default App;
