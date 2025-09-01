import React from 'react';
import { ArrowLeft, Home, Mail, Phone, Globe, Users, BookOpen, Target, Award, Calendar, MapPin } from 'lucide-react';
import foundersImage from '../assets/images/founders.png';

const AboutUs = ({ onBack, onHomeClick }) => {
  const stats = [
    { icon: BookOpen, label: "Stories Analyzed", value: "7000+" },
    { icon: Users, label: "Active Users", value: "20+" },
    { icon: Award, label: "Accuracy Rate", value: "95%" },
    { icon: Target, label: "Age Groups Covered", value: "3" }
  ];

  const websiteFeatures = [
    "Advanced AI-powered story analysis",
    "Human vs AI authorship detection",
    "Sentiment analysis and readability scoring",
    "Age-appropriate content categorization",
    "Safety and bias detection",
    "Educational insights and recommendations"
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-5 flex items-center justify-between sticky top-0 z-50 border-b border-gray-700">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4 hover:text-red-500 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-red-500 text-3xl font-bold">About Us</h1>
        </div>
        <button onClick={onHomeClick} className="flex items-center space-x-1 hover:text-red-500 transition-colors">
          <Home className="h-5 w-5" />
          <span>Home</span>
        </button>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-purple-600 py-20">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">Beyond the Words</h2>
          <p className="text-xl text-white text-opacity-90 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing children's story analysis through advanced AI technology and educational insights.
          </p>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-red-500 mb-8">Meet Our Founders</h3>
          
          {/* Centered Founders Photo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src={foundersImage}
                alt="Beyond the Words Founders"
                className="w-98 h-96 object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              {/* Fallback */}
              <div className="hidden w-96 h-96 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl shadow-2xl border-4 border-gray-700 items-center justify-center flex-col">
                <Users className="h-24 w-24 text-white mb-4" />
                <span className="text-2xl font-bold text-white">Our Founders</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-8 max-w-3xl mx-auto">
            <p className="text-lg text-gray-300 leading-relaxed">
              Founded by passionate educators and technology innovators, Beyond the Words was created with a vision 
              to transform how we understand and analyze children's literature. Our founders combine years of experience 
              in artificial intelligence, natural language processing, and educational technology to create tools that 
              make story analysis accessible and meaningful for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Website Details Section */}
      <section className="bg-gray-800 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12 text-red-500">Our Platform</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Features */}
            <div>
              <h4 className="text-2xl font-semibold mb-6">What We Offer</h4>
              <ul className="space-y-4">
                {websiteFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <span className="text-gray-300 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Website Info */}
            <div className="bg-gray-700 rounded-xl p-8">
              <h4 className="text-2xl font-semibold mb-6">Platform Details</h4>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Calendar className="h-6 w-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold">Launched</p>
                    <p className="text-gray-400">2025</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Globe className="h-6 w-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold">Technology Stack</p>
                    <p className="text-gray-400">React, Django, Python, AI/ML</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold">Based in</p>
                    <p className="text-gray-400">Bangalore, India</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold">Contact</p>
                    <p className="text-gray-400">contact@beyondthewords.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold">Support</p>
                    <p className="text-gray-400">+91 9943290611</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Our Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center bg-gray-800 rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300">
                  <IconComponent className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">Our Mission</h3>
          <p className="text-xl text-white text-opacity-90 leading-relaxed mb-8">
            To empower educators, parents, and children with intelligent tools that unlock the deeper meanings 
            within stories, promoting literacy, critical thinking, and a love for reading through innovative 
            technology and educational insights.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={onHomeClick}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Explore Stories
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;