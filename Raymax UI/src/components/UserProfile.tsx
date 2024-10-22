import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, Pill, AlertTriangle, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface MedicalInfo {
  title: string;
  icon: React.ElementType;
  items: string[];
}

const UserProfile: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const medicalInfo: MedicalInfo[] = [
    {
      title: 'Conditions',
      icon: Heart,
      items: ['Asthma', 'Hypertension', 'Type 2 Diabetes'],
    },
    {
      title: 'Medications',
      icon: Pill,
      items: ['Albuterol inhaler', 'Lisinopril', 'Metformin'],
    },
    {
      title: 'Allergies',
      icon: AlertTriangle,
      items: ['Penicillin', 'Peanuts', 'Dust mites'],
    },
    {
      title: 'Recent Procedures',
      icon: Calendar,
      items: ['Appendectomy (2019)', 'Wisdom teeth removal (2020)', 'Annual physical (2023)'],
    },
  ];

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg p-6 shadow-lg"
    >
      <motion.div
        className="flex items-center mb-6"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mr-4">
          <User size={32} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold gradient-text">Anmol Mangaraj</h2>
          <p className="text-gray-400">Age: 20 | Gender: Male | Blood Type: A+</p>
        </div>
      </motion.div>

      <div className="space-y-4">
        {medicalInfo.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-700 rounded-lg p-4"
          >
            <motion.button
              className="w-full flex items-center justify-between text-left"
              onClick={() => toggleSection(section.title)}
            >
              <div className="flex items-center">
                <section.icon size={24} className="mr-2 text-purple-400" />
                <span className="text-lg font-semibold">{section.title}</span>
              </div>
              {expandedSection === section.title ? (
                <ChevronUp size={20} className="text-purple-400" />
              ) : (
                <ChevronDown size={20} className="text-purple-400" />
              )}
            </motion.button>
            <AnimatePresence>
              {expandedSection === section.title && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 space-y-1"
                >
                  {section.items.map((item, itemIndex) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                      className="text-gray-300"
                    >
                      • {item}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserProfile;