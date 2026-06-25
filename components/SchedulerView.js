import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  FaClock, 
  FaPills, 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaCheck, 
  FaTimes,
  FaBell,
  FaSun,
  FaMoon,
  FaUtensils,
  FaGlassWhiskey,
  FaAppleAlt,
  FaCoffee
} from 'react-icons/fa';
import MedicationForm from './MedicationForm';
import '../styles/SchedulerView.css';

function SchedulerView() {
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterTime, setFilterTime] = useState('all');
  const [editingMedication, setEditingMedication] = useState(null);

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  const sortedMedications = [...medications].sort((a, b) => a.time.localeCompare(b.time));

  const filteredMedications = sortedMedications.filter(med => {
    if (filterTime === 'all') return true;
    const hour = parseInt(med.time.split(':')[0]);
    if (filterTime === 'morning') return hour >= 5 && hour < 12;
    if (filterTime === 'afternoon') return hour >= 12 && hour < 17;
    if (filterTime === 'evening') return hour >= 17 && hour < 21;
    if (filterTime === 'night') return hour >= 21 || hour < 5;
    return true;
  });

  const groupedByTime = filteredMedications.reduce((groups, med) => {
    const key = med.time;
    if (!groups[key]) groups[key] = [];
    groups[key].push(med);
    return groups;
  }, {});

  const handleAddMedication = (medication) => {
    if (editingId) {
      setMedications(medications.map(med => 
        med.id === editingId ? { ...medication, id: editingId } : med
      ));
    } else {
      setMedications([...medications, { ...medication, id: Date.now() }]);
    }
    closeForm();
  };

  const handleEdit = (med) => {
    setEditingId(med.id);
    setEditingMedication(med);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setEditingMedication(null);
  };

  const getTimeEmoji = (time) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 17) return '☀️';
    if (hour >= 17 && hour < 21) return '🌆';
    return '🌙';
  };

  const getTakeWithIcon = (takeWith) => {
    const icons = {
      'with food': <FaUtensils />,
      'with water': <FaGlassWhiskey />,
      'with meal': <FaAppleAlt />,
      'empty stomach': <FaCoffee />,
      'before bed': <FaMoon />
    };
    return icons[takeWith?.toLowerCase()] || null;
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return (
    <div className="scheduler-view">
      <div className="view-header">
        <div>
          <h2><span className="header-icon">📅</span> Daily Medication Schedule</h2>
          <p>Track your medications, dosages, and administration instructions</p>
        </div>
        <button className="add-button" onClick={() => setShowForm(true)}>
          <FaPlus /> Add Medication
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filterTime === 'all' ? 'active' : ''}`}
          onClick={() => setFilterTime('all')}
        >
          All
        </button>
        <button 
          className={`filter-tab ${filterTime === 'morning' ? 'active' : ''}`}
          onClick={() => setFilterTime('morning')}
        >
          <FaSun /> Morning
        </button>
        <button 
          className={`filter-tab ${filterTime === 'afternoon' ? 'active' : ''}`}
          onClick={() => setFilterTime('afternoon')}
        >
          ☀️ Afternoon
        </button>
        <button 
          className={`filter-tab ${filterTime === 'evening' ? 'active' : ''}`}
          onClick={() => setFilterTime('evening')}
        >
          🌆 Evening
        </button>
        <button 
          className={`filter-tab ${filterTime === 'night' ? 'active' : ''}`}
          onClick={() => setFilterTime('night')}
        >
          <FaMoon /> Night
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <MedicationForm
            onSubmit={handleAddMedication}
            onClose={closeForm}
            initialData={editingMedication}
            isEditing={!!editingId}
          />
        )}
      </AnimatePresence>

      {/* Medication Timeline */}
      <div className="timeline">
        {Object.keys(groupedByTime).length === 0 ? (
          <div className="empty-state">
            <FaPills className="empty-icon" />
            <h3>No medications scheduled</h3>
            <p>Click "Add Medication" to start tracking your schedule</p>
          </div>
        ) : (
          Object.entries(groupedByTime).map(([time, meds]) => (
            <div key={time} className="time-group">
              <div className="time-header">
                <span className="time-emoji">{getTimeEmoji(time)}</span>
                <span className="time-label">{formatTime(time)}</span>
                <span className="time-count">{meds.length} medication{meds.length > 1 ? 's' : ''}</span>
              </div>

              <div className="medication-cards">
                {meds.map((med) => (
                  <div
                    key={med.id}
                    className="medication-card"
                    style={{ borderLeftColor: med.color }}
                  >
                    <div className="card-left">
                      <div className="med-header">
                        <h3>{med.name}</h3>
                        <span className="dosage-badge">{med.dosage}</span>
                      </div>
                      
                      <div className="med-details">
                        <div className="detail-item">
                          <FaClock className="detail-icon" />
                          <span>{formatTime(med.time)}</span>
                        </div>
                        <div className="detail-item">
                          <FaBell className="detail-icon" />
                          <span>{med.frequency}</span>
                        </div>
                        {med.takeWith && (
                          <div className="detail-item take-with">
                            {getTakeWithIcon(med.takeWith)}
                            <span>{med.takeWith}</span>
                          </div>
                        )}
                      </div>

                      {med.instructions && (
                        <div className="instructions">
                          <span className="instruction-label">📋 How to take:</span>
                          <span className="instruction-text">{med.instructions}</span>
                        </div>
                      )}

                      {med.notes && (
                        <div className="notes">
                          <span className="notes-label">📝 Notes:</span>
                          <span className="notes-text">{med.notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="card-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(med)}
                        title="Edit medication"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(med.id)}
                        title="Delete medication"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      {medications.length > 0 && (
        <div className="stats-footer">
          <div className="stat-item">
            <span className="stat-number">{medications.length}</span>
            <span className="stat-label">Total Medications</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {new Set(medications.map(m => m.time)).size}
            </span>
            <span className="stat-label">Daily Dosing Times</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {medications.filter(m => m.frequency === 'daily').length}
            </span>
            <span className="stat-label">Daily Medications</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchedulerView;
