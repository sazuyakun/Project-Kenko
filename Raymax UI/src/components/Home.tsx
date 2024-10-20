import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md relative overflow-hidden"
        style={{ zIndex: 1 }} // Ensure form has a higher z-index
      >
        <motion.div
          className="absolute inset-0 bg-purple-600 opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ zIndex: -1 }} // Ensure background animation has a lower z-index
        />
        <h2 className="text-3xl font-bold text-center gradient-text mb-8 animate-float">
          {isLogin ? 'Login to Kenko' : 'Sign Up for Kenko'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <input
                  className="w-full bg-gray-700 text-white p-3 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300"
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                />
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4"
          >
            <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                className="w-full bg-gray-700 text-white p-3 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300"
                id="email"
                type="email"
                placeholder="Enter your email"
                required
              />
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full bg-gray-700 text-white p-3 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300"
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center transition-all duration-300"
            type="submit"
          >
            {isLogin ? 'Login' : 'Sign Up'}
            <ArrowRight className="ml-2" size={20} />
          </motion.button>
        </form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-white mt-4"
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Home;
