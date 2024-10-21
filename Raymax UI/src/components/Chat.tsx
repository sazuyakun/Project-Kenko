import React, { useState } from 'react';
import { Home, MessageSquare, Info, Mail, Upload, FileText, User, Map } from 'lucide-react';  // Import Map icon
import ChatBot from './ChatBot';
import ImageUpload from './ImageUpload';
import VoiceRecorder from './VoiceRecorder';
import ReportAnalysis from './ReportAnalysis';
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FindNearestHospital from './NearestHospital/FindNearestHospital.jsx'

function Chat() {
  const [activeTab, setActiveTab] = useState('Chat');
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: Home, label: 'Login/Signup' },
    { icon: MessageSquare, label: 'Chat' },
    { icon: FileText, label: 'Report Analysis' },
    { icon: User, label: 'User Profile' },
    { icon: Mail, label: 'Send us a mail' },
    { icon: Map, label: 'Emergency Button' },  // Add Emergency Button with Map icon
  ];

  const handleNavigation = (label: string) => {
    switch (label) {
      case 'Login/Signup':
        navigate('/home');
        break;
      case 'Send us a mail':
        navigate('/about');
        break;
      default:
        setActiveTab(label);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Chat':
        return <ChatBot />;
      case 'Report Analysis':
        return <ReportAnalysis />;
      case 'User Profile':
        return <UserProfile />;
      case 'Emergency Button': // Add content for Emergency Button if needed
        return <FindNearestHospital/>
      default:
        return <ChatBot />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-purple-900 p-4"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-12 h-12 bg-purple-700 rounded-full mb-2 animate-pulse-glow"
          ></motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-bold gradient-text"
          >
            Kenko
          </motion.h1>
        </div>
        <nav>
          {sidebarItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-center w-full p-2 mb-2 rounded ${
                activeTab === item.label ? 'bg-purple-700' : 'hover:bg-purple-800'
              } transition-all duration-300`}
              onClick={() => handleNavigation(item.label)}
            >
              <item.icon className="mr-2" size={20} />
              {item.label}
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-4"
        >
          <h2 className="text-2xl font-bold">Welcome to</h2>
          <div className="bg-purple-600 text-white px-4 py-2 rounded-full inline-block mt-2 animate-float">
            Kenko: Your personal AI Health Bot
          </div>
        </motion.header>

        <main className="flex-1 p-4 overflow-y-auto rounded-tr-xl ">
          {renderContent()}
        </main>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-4 flex justify-between items-center"
        >
          <div className="ml-auto flex items-center justify-end">
            <span className="mr-2">John Doe</span>
            <div className="w-10 h-10 bg-purple-200 rounded-full"></div>
          </div>
        </motion.div>
      </div>

      {/* Right Sidebar - Only show for Chat tab */}
      {activeTab === 'Chat' && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-64 bg-gray-800 p-4"
        >
          <div className="mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 animate-float"
            ></motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl font-bold text-center gradient-text"
            >
              Kenko
            </motion.h2>
          </div>
          <ImageUpload />
        </motion.div>
      )}
    </div>
  );
}

export default Chat;
