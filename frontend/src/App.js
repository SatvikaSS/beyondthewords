import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Mail, Phone, X } from 'lucide-react';
import qrCodeImage from './assets/images/YAk6cT_qrcode.png';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AboutUs from './components/AboutUs';
import Dashboard from './components/Dashboard';
import SuperAdmin from './components/SuperAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Search, User, Home, BarChart3, ArrowLeft, BookOpen, Brain, Filter, UserPlus, LogIn, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

// Mock API Base URL - replace with your actual URL
const API_BASE_URL = 'https://beyond-words-backend-um97.onrender.com/api';

// Enhanced API Functions with better error handling and auth headers
const apiCall = async (endpoint, options = {}) => {
  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log(`Making API call to: ${fullUrl}`);
    
    // Try multiple possible token storage keys (from your working version)
    const token = localStorage.getItem('authToken') || 
                  localStorage.getItem('access_token') || 
                  localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Using auth token for request');
    } else {
      console.log('No auth token found');
    }
    
    const response = await fetch(fullUrl, {
      headers,
      ...options
    });
    
    console.log(`API Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return null; // Return null to trigger fallback
    }
    
    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('Network/API Error:', error);
    return null; // Return null to trigger fallback
  }
};



// Profile Component - MODIFIED
const ProfileView = ({ onBack, onHomeClick }) => {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setApiError(null);

      try {
        console.log('Attempting to fetch user profile...');

        // Directly call the correct API endpoint
        const data = await apiCall('/auth/user/profile/');

        if (data && data.id) {
          // Successfully got real profile data
          const profileData = {
            id: data.id,
            username: data.username || data.user || "user",
            email: data.email || user?.email || "user@example.com",
            first_name: data.first_name || data.firstName || data.name?.split(' ')[0] || "User",
            last_name: data.last_name || data.lastName || data.name?.split(' ').slice(1).join(' ') || "Name",
            age_group: data.age_group || data.preferred_age_group || data.ageGroup || "All Ages",
            date_joined: data.date_joined || data.created_at || data.joined_at || data.createdAt || new Date().toISOString()
          };
          setUserProfile(profileData);
        } else {
          // API didn't return profile data, extract what we can from email and use placeholders
          setApiError("Could not fetch profile from API or invalid data returned.");
          const emailParts = user?.email ? user.email.split('@')[0].split('.') : ['user'];
          const firstName = emailParts[0] ? emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1) : 'User';
          const lastName = emailParts[1] ? emailParts[1].charAt(0).toUpperCase() + emailParts[1].slice(1) : 'Name';
          
          const profileData = {
            id: 1,
            username: user?.email?.split('@')[0] || "user",
            email: user?.email || "user@example.com",
            first_name: firstName,
            last_name: lastName,
            age_group: "Not Set",
            date_joined: new Date().toISOString()
          };
          setUserProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setApiError(`Error: ${error.message}`);
        
        // Extract info from email if available
        const emailParts = user?.email ? user.email.split('@')[0].split('.') : ['user'];
        const firstName = emailParts[0] ? emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1) : 'User';
        const lastName = emailParts[1] ? emailParts[1].charAt(0).toUpperCase() + emailParts[1].slice(1) : 'Name';
        
        const fallbackProfile = {
          id: 1,
          username: user?.email?.split('@')[0] || "user",
          email: user?.email || "user@example.com",
          first_name: firstName,
          last_name: lastName,
          age_group: "Not Set",
          date_joined: new Date().toISOString()
        };
        setUserProfile(fallbackProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    // Navigation to landing page is handled by the auth context
  };

  const formatJoinDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-5 flex items-center justify-between sticky top-0 z-50 border-b border-gray-700">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4 hover:text-red-500 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-red-500 text-3xl font-bold">User Profile</h1>
        </div>
        <button onClick={onHomeClick} className="flex items-center space-x-1 hover:text-red-500 transition-colors">
          <Home className="h-5 w-5" />
          <span>Home</span>
        </button>
      </header>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-red-500 to-purple-600 p-8 text-center">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {userProfile?.first_name && userProfile?.last_name 
                ? `${userProfile.first_name} ${userProfile.last_name}`
                : 'User Name'
              }
            </h2>
            {apiError && (
              <p className="text-yellow-300 text-sm mt-2">⚠️ Using fallback data - API connection issue</p>
            )}
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Full Name</h3>
                  <p className="text-lg font-semibold text-white">
                    {userProfile?.first_name && userProfile?.last_name 
                      ? `${userProfile.first_name} ${userProfile.last_name}`
                      : 'Not Available'
                    }
                  </p>
                  {userProfile?.first_name === 'User' && userProfile?.last_name === 'Name' && (
                    <p className="text-xs text-yellow-400 mt-1">⚠️ Extracted from email - update in database</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Email Address</h3>
                  <p className="text-lg font-semibold text-white">{userProfile?.email || 'Not Available'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Preferred Age Group</h3>
                  <p className="text-lg font-semibold text-white">{userProfile?.age_group || "Not Set"}</p>
                  {userProfile?.age_group === 'Not Set' && (
                    <p className="text-xs text-yellow-400 mt-1">⚠️ Not configured in profile</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Member Since</h3>
                  <p className="text-lg font-semibold text-white">
                    {userProfile?.date_joined ? formatJoinDate(userProfile.date_joined) : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
            {/* Logout Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors font-semibold"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data for testing when API is not available
const mockStories = [
  {
    id: 1,
    title: "The Brave Little Mouse",
    story: "Once upon a time, there was a brave little mouse who lived in a big house. The mouse was very curious and always wanted to explore new places.",
    age_group: "4-6",
    source: "Human",
    safety_violations: { present: false },
    stereotypes_biases: { present: false }
  },
  {
    id: 2,
    title: "Adventures in Space",
    story: "Captain Sarah and her crew embarked on an incredible journey through the galaxy, discovering new planets and making friends with alien creatures.",
    age_group: "7-12",
    source: "AI",
    safety_violations: { present: false },
    stereotypes_biases: { present: false }
  },
  {
    id: 3,
    title: "The Magic Garden",
    story: "In a secret garden behind an old mansion, magical flowers bloomed that could grant wishes to those who were kind and patient.",
    age_group: "7-12",
    source: "Human",
    safety_violations: { present: false },
    stereotypes_biases: { present: false }
  },
  {
    id: 4,
    title: "Robot Friends",
    story: "In the year 2050, a young girl befriends a helpful robot who teaches her about technology and the importance of friendship.",
    age_group: "13+",
    source: "AI",
    safety_violations: { present: false },
    stereotypes_biases: { present: false }
  },
  {
    id: 5,
    title: "The Playground Slip",
    story: "A curious little boy named Leo was at the playground when he decided to try the giant, winding slide. It looked a little scary, but his friends cheered him on. He climbed to the top, took a deep breath, and slid down with a huge smile on his face.",
    age_group: "4-6",
    source: "Human",
    safety_violations: { present: false },
    stereotypes_biases: { present: false }
  },
  {
    id: 6,
    title: "The Mystery of the Missing Key",
    story: "Two young detectives, Maya and Alex, were on the case of a missing antique key. Their search led them through a dusty old library and a hidden passageway, solving riddles along the way.",
    age_group: "13+",
    source: "AI",
    safety_violations: { present: false },
    stereotypes_biases: { present: false }
  }
];

// Landing Page Component with Authentication Navigation
const LandingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white p-6">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-8 text-red-500 animate-fade-in-down">
          Beyond the Words
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-12 animate-fade-in max-w-2xl mx-auto">
          Discover a new way to explore and analyze children's stories.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <a
            href="/signin"
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-500 to-purple-600 group-hover:from-red-500 group-hover:to-purple-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative flex items-center gap-2 px-8 py-3 transition-all ease-in duration-75 bg-gray-900 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 md:px-10 md:py-4 text-base md:text-lg font-medium text-white">
              <LogIn className="h-5 w-5" /> Sign In
            </span>
          </a>
          <a
            href="/signup"
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative flex items-center gap-2 px-8 py-3 transition-all ease-in duration-75 bg-gray-900 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 md:px-10 md:py-4 text-base md:text-lg font-medium text-white">
              <UserPlus className="h-5 w-5" /> Sign Up
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};


// Add this Contact Modal component before your Homepage component
const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Mail className="h-5 w-5 text-red-500" />
              <span className="text-gray-400 text-sm">Email</span>
            </div>
            <p className="text-white font-medium">contact@beyondthewords.com</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Phone className="h-5 w-5 text-red-500" />
              <span className="text-gray-400 text-sm">Phone</span>
            </div>
            <p className="text-white font-medium">+91 9943290611</p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            We'd love to hear from you! Reach out with any questions or feedback.
          </p>
        </div>
      </div>
    </div>
  );
};

// Component for the main homepage (after login)
const Homepage = ({ stories, onStoryClick, onSearch, searchTerm, onHomeClick, onFilterChange, selectedAgeGroup, onProfileClick }) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false); 

  // Add these handler functions in your Homepage component
  const handleContactClick = () => {
    setShowContactModal(true);
  };

  const handleAboutClick = () => {
    window.location.href = '/about'; // Or use navigate('/about') if you pass navigate as prop
  };
  
  const categorizeStories = () => {
    const categories = {
      'Popular Stories': stories.filter(story => story.id <= 4),
      'Recommended For You': stories.filter(story => story.id > 4),
      'AI Generated': stories.filter(story => story.source === 'AI'),
      'Human Written': stories.filter(story => story.source === 'Human')
    };
    return categories;
  };

  const categories = categorizeStories();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-5 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50 border-b border-gray-700">
        <h1 className="text-red-500 text-3xl font-bold mb-4 md:mb-0">Beyond the Words</h1>
        
        <div className="flex-1 w-full md:w-auto flex justify-center mx-0 md:mx-8">
            <div className="relative w-full max-w-xl">
                <input
                    type="text"
                    placeholder="Search stories..."
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
        </div>

        <nav className="flex space-x-6 mt-4 md:mt-0">
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={`flex items-center space-x-1 p-2 rounded-full hover:text-red-500 transition-colors ${selectedAgeGroup ? 'bg-red-500 text-white' : 'text-gray-400'}`}
            >
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => { onFilterChange(null); setIsFilterDropdownOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  Clear Filter
                </button>
                <button
                  onClick={() => { onFilterChange('4-6'); setIsFilterDropdownOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  4-6 years
                </button>
                <button
                  onClick={() => { onFilterChange('7-12'); setIsFilterDropdownOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  7-12 years
                </button>
                <button
                  onClick={() => { onFilterChange('13+'); setIsFilterDropdownOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  13+ years
                </button>
              </div>
            )}
          </div>
          <button onClick={onHomeClick} className="flex items-center space-x-1 hover:text-red-500 transition-colors">
            <Home className="h-5 w-5" />
            <span>Home</span>
          </button>
          <button onClick={onProfileClick} className="flex items-center space-x-1 hover:text-red-500 transition-colors">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </button>
        </nav>
      </header>

      {/* Simple Video Banner */}
      <div className="relative h-96 overflow-hidden border-b-4 border-red-500 flex items-end p-16 bg-gray-800">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          controls={false}  
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/dcj0pzlv2/video/upload/v123456789/hero-video_kmveb6.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Fallback background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 -z-10"></div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Text content */}
        <h2 className="relative z-10 text-4xl font-bold bg-black bg-opacity-60 px-6 py-3 rounded-lg">
          Discover Stories: Beyond The Words
        </h2>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="p-8 pb-4">
          <p className="text-gray-400">
            {stories.length > 0 
              ? `Found ${stories.length} story(ies) matching "${searchTerm}"`
              : `No stories found for "${searchTerm}"`
            }
          </p>
        </div>
      )}
      
      {/* Filter Info */}
      {selectedAgeGroup && (
        <div className="p-8 pb-4 pt-0">
          <p className="text-gray-400">
            Showing stories for the **{selectedAgeGroup}** age group.
          </p>
        </div>
      )}

      {/* Story Categories */}
      <div className="p-8 space-y-8">
        {Object.entries(categories).map(([categoryName, categoryStories]) => (
          categoryStories.length > 0 && (
            <div key={categoryName}>
              <h3 className="text-2xl font-semibold text-red-500 mb-5 text-left">{categoryName}</h3>
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800" style={{scrollBehavior: 'smooth'}}>
                {categoryStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => onStoryClick(story)}
                    className="min-w-48 bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                  >
                    <div className="h-60 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-white opacity-80" />
                    </div>
                    <div className="p-3">
                      <p className="text-center font-medium">{story.title}</p>
                      <p className="text-center text-sm text-gray-400 mt-1">
                        Age {story.age_group}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
        
        {/* No stories message */}
        {stories.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No stories found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedAgeGroup ? 'Try a different search term or clear the filter' : 'Stories will appear here once loaded'}
            </p>
          </div>
        )}
      </div>

      <footer className="bg-gray-800 border-t border-gray-700 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Left side - Main content */}
            <div className="flex-1 text-center">
              {/* Copyright */}
              <div className="text-red-500 mb-4">
                © 2025 Beyond the Words. All rights reserved.
              </div>
              
              {/* Navigation Links */}
              <div className="flex justify-center space-x-6 mb-4">
                <button
                  onClick={handleContactClick}
                  className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
                <button
                  onClick={handleAboutClick}
                  className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </div>
              
              {/* Tagline */}
              <div className="text-gray-500 text-sm">
                Discover Stories Beyond The Words
              </div>
            </div>

            {/* Right side - QR Code */}
            <div className="flex flex-col items-center ml-8">
              <img 
                src={qrCodeImage}
                alt="QR Code" 
                className="w-32 h-32 mb-2"
              />
            </div>
          </div>
        </div>
      </footer>
       

      {/* Contact Modal */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </div>
  );
};

// Component for displaying individual story
const StoryView = ({ story, onBack, onDetailedAnalysis, onAuthorshipCheck, similarStories = [], onSimilarStoryClick, onHomeClick }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center">
            <button onClick={onBack} className="mr-4 hover:text-red-500 transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-red-500 text-3xl font-bold">Beyond the Words</h1>
        </div>
        <button onClick={onHomeClick} className="flex items-center space-x-1 hover:text-red-500 transition-colors">
            <Home className="h-5 w-5" />
            <span>Home</span>
        </button>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        {/* Story Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-4">{story.title}</h2>
          <div className="flex gap-4 text-sm text-gray-400 mb-6">
            <span>Age Group: {story.age_group}</span>
            {story.safety_violations?.present && (
              <span className="text-yellow-500">⚠️ Safety Notice</span>
            )}
          </div>
        </div>

        {/* Story Content */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="prose prose-invert max-w-none">
            {story.story.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={onDetailedAnalysis}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <BarChart3 className="h-5 w-5" />
            Detailed Analysis
          </button>
          <button
            onClick={onAuthorshipCheck}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Brain className="h-5 w-5" />
            Authorship Detection
          </button>
        </div>

        {/* Safety Violations & Biases */}
        {(story.safety_violations?.present || story.stereotypes_biases?.present) && (
          <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6 mb-8">
            <h3 className="text-yellow-400 font-semibold mb-3">Content Warnings</h3>
            {story.safety_violations?.present && (
              <div className="mb-3">
                <p className="font-medium">Safety Violations:</p>
                <p className="text-sm text-gray-300">{story.safety_violations.description}</p>
                <p className="text-xs text-gray-400">Type: {story.safety_violations.type} | Severity: {story.safety_violations.severity}</p>
              </div>
            )}
            {story.stereotypes_biases?.present && (
              <div>
                <p className="font-medium">Stereotypes & Biases:</p>
                <p className="text-sm text-gray-300">{story.stereotypes_biases.description}</p>
                <p className="text-xs text-gray-400">Type: {story.stereotypes_biases.type}</p>
              </div>
            )}
          </div>
        )}

        {/* Similar Stories */}
        {similarStories.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-red-500 mb-5 text-left">Similar Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similarStories.map((similarStory) => (
                <div
                  key={similarStory.id}
                  onClick={() => onSimilarStoryClick(similarStory)}
                  className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <h4 className="font-semibold mb-2">{similarStory.title}</h4>
                  <p className="text-sm text-gray-400 mb-2">
                    Age {similarStory.age_group}
                  </p>
                  <p className="text-sm text-gray-300 line-clamp-3">
                    {similarStory.story.substring(0, 150)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for detailed analysis results
const AnalysisView = ({ story, analysisData, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-5 flex items-center sticky top-0 z-50">
        <button onClick={onBack} className="mr-4 hover:text-red-500 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-red-500 text-3xl font-bold">Detailed Analysis: {story.title}</h1>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-blue-400 font-semibold mb-2">Word Count</h3>
            <p className="text-3xl font-bold">{analysisData.word_count}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-green-400 font-semibold mb-2">Sentence Count</h3>
            <p className="text-3xl font-bold">{analysisData.sentence_count}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-purple-400 font-semibold mb-2">Lexical Diversity (TTR)</h3>
            <p className="text-3xl font-bold">{analysisData.ttr.toFixed(3)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-yellow-400 font-semibold mb-2">Flesch-Kincaid Grade</h3>
            <p className="text-3xl font-bold">{analysisData.flesch_kincaid_grade.toFixed(1)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-red-400 font-semibold mb-2">ARI Score</h3>
            <p className="text-3xl font-bold">{analysisData.ari_score.toFixed(1)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-indigo-400 font-semibold mb-2">Sentiment</h3>
            <p className="text-2xl font-bold capitalize">{analysisData.sentiment_label}</p>
            <p className="text-sm text-gray-400">Score: {analysisData.sentiment_score.toFixed(3)}</p>
          </div>
        </div>

        {/* POS Distribution Chart */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-left">Part-of-Speech Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analysisData.pos_distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Bar dataKey="value" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Component for authorship detection results
const AuthorshipView = ({ story, authorshipResult, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-5 flex items-center sticky top-0 z-50">
        <button onClick={onBack} className="mr-4 hover:text-red-500 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-red-500 text-3xl font-bold">Authorship Detection: {story.title}</h1>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="mb-6">
            <Brain className="h-16 w-16 mx-auto mb-4 text-purple-400" />
            <h2 className="text-3xl font-bold mb-4">Authorship Analysis Result</h2>
          </div>
          
          <div className="mb-6">
            <div className={`inline-flex items-center px-8 py-4 rounded-full text-2xl font-bold ${
              authorshipResult.predicted_source === 'AI' 
                ? 'bg-purple-600 text-white' 
                : 'bg-green-600 text-white'
            }`}>
              {authorshipResult.predicted_source === 'AI' ? '🤖' : '👤'} {authorshipResult.predicted_source} Generated
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Confidence Score</h3>
              <div className="text-3xl font-bold text-blue-400">
                {(authorshipResult.confidence_score * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Actual Source</h3>
              <div className="text-3xl font-bold text-yellow-400">
                {story.source}
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Analysis Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Repetition Score</p>
                <p className="font-bold">{authorshipResult.features.repetition_score.toFixed(3)}</p>
              </div>
              <div>
                <p className="text-gray-400">Avg Sentence Length</p>
                <p className="font-bold">{authorshipResult.features.avg_sentence_length.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-gray-400">Complexity Score</p>
                <p className="font-bold">{authorshipResult.features.complexity_score.toFixed(3)}</p>
              </div>
              <div>
                <p className="text-gray-400">Punctuation Ratio</p>
                <p className="font-bold">{authorshipResult.features.punctuation_ratio.toFixed(3)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Story Management Component (the main stories page)
// Story Management Component (the main stories page)
const StoryApp = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [currentView, setCurrentView] = useState('homepage');
  const [selectedStory, setSelectedStory] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [authorshipResult, setAuthorshipResult] = useState(null);
  const [similarStories, setSimilarStories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all stories from API with pagination
  useEffect(() => {
    const fetchAllStories = async () => {
      setLoading(true);
      const allStories = [];
      let nextUrl = '/stories/';

      try {
        // Keep fetching pages until there are no more
        while (nextUrl) {
          const response = await apiCall(nextUrl);

          // Check if response has a 'results' array and a 'next' link
          if (response && response.results) {
            allStories.push(...response.results);
            nextUrl = response.next ? response.next.replace(API_BASE_URL, '') : null;
          } else {
            console.error('API did not return a valid paginated response:', response);
            nextUrl = null; // Stop the loop on error
          }
        }

        if (allStories.length > 0) {
          console.log(`✅ Successfully loaded ${allStories.length} stories from API`);
          setStories(allStories);
        } else {
          console.log('⚠️ API returned no stories, using mock data');
          setStories(mockStories);
        }
      } catch (error) {
        console.error('❌ Error fetching stories:', error);
        setStories(mockStories); // Fallback to mock data on network error
      } finally {
        setLoading(false);
        console.log('Stories loading completed');
      }
    };

    fetchAllStories();
  }, []);

  // This effect handles filtering logic when stories, search term, or age group changes.
  useEffect(() => {
    let newFilteredStories = [...stories];

    // Apply search filter first
    if (searchTerm) {
      newFilteredStories = newFilteredStories.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.story.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.age_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply age group filter second
    if (selectedAgeGroup) {
      newFilteredStories = newFilteredStories.filter(story => story.age_group === selectedAgeGroup);
    }

    setFilteredStories(newFilteredStories);

  }, [stories, searchTerm, selectedAgeGroup]);

  // Search functionality
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (ageGroup) => {
    setSelectedAgeGroup(ageGroup);
  };

  // Handle story selection
  const handleStoryClick = async (story) => {
    setSelectedStory(story);
    setCurrentView('story');

    // Get similar stories
    try {
      const similar = await apiCall(`/stories/${story.id}/similar/`);
      if (similar && Array.isArray(similar)) {
        setSimilarStories(similar);
      } else {
        // Mock similar stories if API fails
        const mockSimilar = stories.filter(s =>
          s.id !== story.id && s.age_group === story.age_group
        ).slice(0, 3);
        setSimilarStories(mockSimilar);
      }
    } catch (error) {
      console.error('Error fetching similar stories:', error);
      setSimilarStories([]);
    }
  };

  const handleHomeClick = () => {
    setCurrentView('homepage');
    setSelectedStory(null);
    setSearchTerm('');
    setSelectedAgeGroup(null);
  };

  const handleProfileClick = () => {
    setCurrentView('profile');
  };

  // Handle detailed analysis
  const handleDetailedAnalysis = async () => {
    setLoading(true);
    try {
      const data = await apiCall(`/stories/${selectedStory.id}/analyze/`, {
        method: 'POST'
      });

      if (data) {
        setAnalysisData(data);
        setCurrentView('analysis');
      } else {
        // Mock analysis data if API fails
        const mockAnalysis = {
          word_count: selectedStory.story.split(' ').length,
          sentence_count: selectedStory.story.split('.').length - 1,
          ttr: 0.75,
          flesch_kincaid_grade: 6.2,
          ari_score: 5.8,
          sentiment_label: 'positive',
          sentiment_score: 0.85,
          pos_distribution: [
            { name: 'Nouns', value: 45 },
            { name: 'Verbs', value: 25 },
            { name: 'Adjectives', value: 15 },
            { name: 'Adverbs', value: 10 },
            { name: 'Others', value: 5 }
          ]
        };
        setAnalysisData(mockAnalysis);
        setCurrentView('analysis');
      }
    } catch (error) {
      console.error('Error performing analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle authorship detection
  const handleAuthorshipCheck = async () => {
    setLoading(true);
    try {
      const data = await apiCall(`/stories/${selectedStory.id}/detect_authorship/`, {
        method: 'POST'
      });

      if (data) {
        setAuthorshipResult(data);
        setCurrentView('authorship');
      } else {
        // Mock authorship data if API fails
        const mockAuthorship = {
          predicted_source: selectedStory.source === 'AI' ? 'AI' : 'Human',
          confidence_score: 0.92,
          features: {
            repetition_score: 0.15,
            avg_sentence_length: 18.5,
            complexity_score: 0.68,
            punctuation_ratio: 0.08
          }
        };
        setAuthorshipResult(mockAuthorship);
        setCurrentView('authorship');
      }
    } catch (error) {
      console.error('Error checking authorship:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate back functions
  const handleBack = () => {
    if (currentView === 'story') {
      setCurrentView('homepage');
      setSelectedStory(null);
    } else if (currentView === 'profile') {
      setCurrentView('homepage');
    } else {
      setCurrentView('story');
    }
  };

  // Handle similar story click
  const handleSimilarStoryClick = (story) => {
    handleStoryClick(story);
  };

  // Render current view
  const renderCurrentView = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      );
    }

    switch (currentView) {
      case 'homepage':
        return (
          <Homepage
            stories={filteredStories}
            onStoryClick={handleStoryClick}
            onSearch={handleSearch}
            searchTerm={searchTerm}
            onHomeClick={handleHomeClick}
            onFilterChange={handleFilterChange}
            selectedAgeGroup={selectedAgeGroup}
            onProfileClick={handleProfileClick}
          />
        );
      case 'profile':
        return (
          <ProfileView
            onBack={handleBack}
            onHomeClick={handleHomeClick}
          />
        );
      case 'story':
        return (
          <StoryView
            story={selectedStory}
            onBack={handleBack}
            onDetailedAnalysis={handleDetailedAnalysis}
            onAuthorshipCheck={handleAuthorshipCheck}
            similarStories={similarStories}
            onSimilarStoryClick={handleSimilarStoryClick}
            onHomeClick={handleHomeClick}
          />
        );
      case 'analysis':
        return (
          <AnalysisView
            story={selectedStory}
            analysisData={analysisData}
            onBack={handleBack}
          />
        );
      case 'authorship':
        return (
          <AuthorshipView
            story={selectedStory}
            authorshipResult={authorshipResult}
            onBack={handleBack}
          />
        );
      default:
        return <div>Unknown view</div>;
    }
  };

  return <div className="StoryApp">{renderCurrentView()}</div>;
};

const AboutUsWrapper = () => {
  const navigate = useNavigate(); // You'll need to import useNavigate from react-router-dom
  
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };
  
  const handleHomeClick = () => {
    navigate('/stories'); // Navigate to stories/dashboard
  };
  
  return (
    <AboutUs 
      onBack={handleBack}
      onHomeClick={handleHomeClick}
    />
  );
};

// MAIN APP COMPONENT with proper authentication flow
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/stories" 
              element={
                <ProtectedRoute>
                  <StoryApp />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <SuperAdmin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/about" 
              element={
                <ProtectedRoute>
                  <AboutUsWrapper />
                </ProtectedRoute>
              } 
            />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
