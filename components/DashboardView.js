import React, { useState, useEffect } from 'react';
import { 
  FaChartPie, 
  FaPills, 
  FaClock, 
  FaBell, 
  FaExclamationTriangle,
  FaCalendarCheck
} from 'react-icons/fa';
import '../styles/DashboardView.css';

function DashboardView() {
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });

  const totalMeds = medications.length;
  const timesCount = new Set(medications.map(m => m.time)).size;
  const dailyMeds = medications.filter(m => m.frequency === 'daily').length;
  
  // Get upcoming medications (next 4)
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const upcoming = [...medications]
    .filter(med => med.time >= currentTime)
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 4);

  // Most common administration times
  const timeCounts = medications.reduce((acc, med) => {
    const hour = parseInt(med.time.split(':')[0]);
    const period = hour >= 5 && hour < 12 ? 'Morning' :
                   hour >= 12 && hour < 17 ? 'Afternoon' :
                   hour >= 17 && hour < 21 ? 'Evening' : 'Night';
    acc[period] = (acc[period] || 0) + 1;
    return acc;
  }, {});

  // Adherence stats (mock - would need actual tracking)
  const totalDoses = medications.reduce((acc, med) => {
    if (med.frequency === 'daily') return acc + 1;
    if (med.frequency === 'twice-daily') return acc + 2;
    if (med.frequency === 'three-times') return acc + 3;
    return acc + 1;
  }, 0);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return (
    <div className="dashboard-view">
      <div className="view-header">
        <h2><span className="header-icon">📊</span> Medication Dashboard</h2>
        <p>Overview of your medication schedule and adherence</p>
      </div>

      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#4F46E5' }}>
            <FaPills />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-number">{totalMeds}</span>
            <span className="stat-card-label">Total Medications</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#059669' }}>
            <FaClock />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-number">{timesCount}</span>
            <span className="stat-card-label">Daily Dosing Times</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#D97706' }}>
            <FaBell />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-number">{dailyMeds}</span>
            <span className="stat-card-label">Daily Medications</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#DC2626' }}>
            <FaExclamationTriangle />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-number">
              {medications.filter(m => m.notes && m.notes.toLowerCase().includes('refill')).length}
            </span>
            <span className="stat-card-label">Needs Refill</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#7C3AED' }}>
            <FaCalendarCheck />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-number">{totalDoses}</span>
            <span className="stat-card-label">Daily Doses</span>
          </div>
        </div>
      </div>

      {/* Upcoming Medications */}
      <div className="dashboard-section">
        <h3>⏰ Upcoming Medications</h3>
        {upcoming.length > 0 ? (
          <div className="upcoming-list">
            {upcoming.map(med => (
              <div key={med.id} className="upcoming-item" style={{ borderLeftColor: med.color }}>
                <div className="upcoming-time">
                  <FaClock />
                  <span>{formatTime(med.time)}</span>
                </div>
                <div className="upcoming-info">
                  <strong>{med.name}</strong>
                  <span className="upcoming-dosage">{med.dosage}</span>
                </div>
                {med.takeWith && (
                  <span className="upcoming-takewith">📌 {med.takeWith}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No upcoming medications scheduled</p>
        )}
      </div>

      <div className="dashboard-row">
        {/* Time Distribution */}
        <div className="dashboard-section half-width">
          <h3>📊 Distribution by Time</h3>
          <div className="distribution-bars">
            {Object.entries(timeCounts).length > 0 ? (
              Object.entries(timeCounts).map(([period, count]) => (
                <div key={period} className="distribution-item">
                  <span className="distribution-label">{period}</span>
                  <div className="distribution-bar-container">
                    <div 
                      className="distribution-bar" 
                      style={{ 
                        width: `${(count / totalMeds) * 100}%`,
                        background: period === 'Morning' ? '#F59E0B' :
                                    period === 'Afternoon' ? '#3B82F6' :
                                    period === 'Evening' ? '#8B5CF6' : '#6366F1'
                      }}
                    />
                  </div>
                  <span className="distribution-count">{count}</span>
                </div>
              ))
            ) : (
              <p className="no-data">No medications to display</p>
            )}
          </div>
        </div>

        {/* Medication List Summary */}
        <div className="dashboard-section half-width">
          <h3>📋 Medication List</h3>
          <div className="summary-list">
            {medications.length > 0 ? (
              medications.slice(0, 6).map(med => (
                <div key={med.id} className="summary-item">
                  <span className="summary-color" style={{ background: med.color }}></span>
                  <span className="summary-name">{med.name}</span>
                  <span className="summary-dosage">{med.dosage}</span>
                  <span className="summary-time">{formatTime(med.time)}</span>
                </div>
              ))
            ) : (
              <p className="no-data">No medications added yet</p>
            )}
            {medications.length > 6 && (
              <p className="more-items">+ {medications.length - 6} more medications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
