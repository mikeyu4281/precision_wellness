import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import '../styles/SchedulerView.css';

function MedicationForm({ onSubmit, onClose, initialData, isEditing }) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time: '08:00',
    frequency: 'daily',
    notes: '',
    instructions: '',
    takeWith: '',
    color: '#4F46E5'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) return;
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal">
        <h2>{isEditing ? '✏️ Edit Medication' : '➕ Add New Medication'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Medication Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Metformin"
                required
              />
            </div>

            <div className="form-group">
              <label>Dosage *</label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 500mg"
                required
              />
            </div>

            <div className="form-group">
              <label>Time to Take *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              >
                <option value="daily">Daily</option>
                <option value="twice-daily">Twice Daily</option>
                <option value="three-times">Three Times Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as-needed">As Needed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Take With</label>
              <select
                value={formData.takeWith}
                onChange={(e) => setFormData({ ...formData, takeWith: e.target.value })}
              >
                <option value="">Select...</option>
                <option value="with food">With Food</option>
                <option value="with water">With Water</option>
                <option value="with meal">With Meal</option>
                <option value="empty stomach">Empty Stomach</option>
                <option value="before bed">Before Bed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Color Label</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Administration Instructions</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="e.g., Take with a full glass of water, Do not crush..."
                rows="2"
              />
            </div>

            <div className="form-group full-width">
              <label>Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g., Refill needed in 2 weeks, Take before exercise..."
                rows="2"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="submit-btn">
              <FaCheck /> {isEditing ? 'Update' : 'Add'} Medication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MedicationForm;
