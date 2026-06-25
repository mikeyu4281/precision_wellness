import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPills, 
  FaSearch, 
  FaCalendarAlt, 
  FaChartPie,
  FaRobot 
} from 'react-icons/fa';
import SearchView from './components/SearchView';
import SchedulerView from './components/SchedulerView';
import DashboardView from './components/DashboardView';
import ChatbotView from './components/ChatbotView';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>
          <FaPills className="app-icon" />
          MediTrack
        </h1>
        <p className="app-subtitle">Medication Safety & Schedule Manager</p>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <FaSearch /> Search
        </button>
        <button 
          className={`tab-btn ${activeTab === 'scheduler' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduler')}
        >
          <FaCalendarAlt /> Schedule
        </button>
        <button 
          className={`tab-btn ${activeTab === 'chatbot' ? 'active' : ''}`}
          onClick={() => setActiveTab('chatbot')}
        >
          <FaRobot /> Assistant
        </button>
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <FaChartPie /> Dashboard
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <SearchView />
          </motion.div>
        )}
        
        {activeTab === 'scheduler' && (
          <motion.div
            key="scheduler"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <SchedulerView />
          </motion.div>
        )}

        {activeTab === 'chatbot' && (
          <motion.div
            key="chatbot"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ChatbotView />
          </motion.div>
        )}
        
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardView />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="app-footer">
        <p>⚠️ This information is for educational purposes only. Always consult your healthcare provider.</p>
      </footer>
    </div>
  );
}

export default App;
