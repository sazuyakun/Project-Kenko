import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/chat')}
          className="mb-6 flex items-center text-purple-400 hover:text-purple-300 transition-all duration-300"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Chat
        </motion.button>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold text-center gradient-text mb-4 animate-float"
        >
          Team Plutonium
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl font-semibold text-center text-purple-400 mb-8"
        >
          "PROJECT KENKO"
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-white text-lg leading-relaxed mb-8"
        >
          Project KENKO is an innovative AI-powered health assistant designed to revolutionize 
          personal healthcare. Our mission is to provide accessible, accurate, and personalized 
          health information to users worldwide, leveraging cutting-edge artificial intelligence 
          and machine learning technologies.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-gray-900 p-6 rounded-lg animate-pulse-glow"
        >
          <h3 className="text-xl font-bold text-white mb-4">Send us a mail</h3>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300"
            />
            <textarea
              placeholder="Your message"
              rows={4}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300"
            ></textarea>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;