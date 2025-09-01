import React, { useState, useEffect } from 'react';
import { User, ArrowLeft, LogOut, Home } from 'lucide-react';

const ProfileView = ({ onBack, onLogout }) => {
  const [user, setUser] = useState(null);

  // This useEffect hook runs once when the component is loaded.
  // It's the perfect place to fetch the user data from local storage.
  useEffect(() => {
    // Check for the 'user' data in the browser's local storage.
    const storedUser = localStorage.getItem('user');
    
    // If user data exists, parse it from a string back into a JavaScript object.
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData); // Set the user state with the fetched data.
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        // Clear invalid data to avoid issues.
        localStorage.removeItem('user');
        setUser(null);
      }
    }
  }, []); // The empty array ensures this effect runs only once on mount.

  // Display a loading message or a prompt if user data isn't available.
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-8 bg-gray-800 rounded-xl">
          <p className="text-lg">No user data found. Please log in first.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-red-600 rounded-lg text-white font-bold hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Once the user state is populated, render the profile view.
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl bg-gray-800 rounded-xl p-6 flex justify-between items-center mb-10 shadow-lg">
        <button onClick={onBack} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 inline-block mr-1" /> Back
        </button>
        <h1 className="text-2xl font-bold text-red-500">My Profile</h1>
        <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          <LogOut className="h-5 w-5 inline-block mr-1" /> Logout
        </button>
      </header>

      <div className="w-full max-w-md bg-gray-800 rounded-xl p-8 text-center shadow-lg">
        <div className="mb-6">
          <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-3xl font-bold text-gray-300">User Information</h2>
        </div>
        
        <div className="space-y-4 text-left">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-400 w-28">Name:</span>
            <span>{user.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-400 w-28">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-400 w-28">Age Group:</span>
            <span>{user.ageGroup || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
