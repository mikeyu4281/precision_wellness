import React, { useState } from 'react';
import axios from 'axios';
import SafetyCard from './SafetyCard';
import '../styles/SearchView.css';

function SearchView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drugData, setDrugData] = useState(null);

  const searchMedication = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setDrugData(null);

    try {
      const response = await axios.get(
        `https://api.fda.gov/drug/label.json`,
        {
          params: {
            search: `openfda.brand_name:${searchTerm}* OR openfda.generic_name:${searchTerm}*`,
            limit: 1,
          },
        }
      );

      if (response.data.results && response.data.results.length > 0) {
        setDrugData(response.data.results[0]);
      } else {
        setError('No medication found. Please try a different search.');
      }
    } catch (err) {
      setError('Error fetching medication data. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getField = (data, fieldPath) => {
    const parts = fieldPath.split('.');
    let current = data;
    for (const part of parts) {
      if (!current || !current[part]) return null;
      current = current[part];
    }
    if (Array.isArray(current)) {
      return current.join('; ');
    }
    return current || null;
  };

  return (
    <div className="search-view">
      <div className="view-header">
        <h2><span className="header-icon">🔍</span> Medication Safety Search</h2>
        <p>Search for adverse events, side effects, interactions, and risk compounds</p>
      </div>

      <form onSubmit={searchMedication} className="search-form">
        <input
          type="text"
          placeholder="Enter medication name (e.g., Ibuprofen, Metformin)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : '🔍 Search'}
        </button>
      </form>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Fetching medication safety data...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {drugData && (
        <div className="results-container">
          <div className="drug-header">
            <h3>{getField(drugData, 'openfda.brand_name') || 'Unknown Brand'}</h3>
            <p className="generic-name">
              Generic: {getField(drugData, 'openfda.generic_name') || 'N/A'}
            </p>
          </div>

          <div className="safety-grid">
            <SafetyCard
              title="Adverse Events & Side Effects"
              icon="⚠️"
              content={getField(drugData, 'adverse_reactions')}
              fallback="No adverse reaction data available"
            />
            <SafetyCard
              title="Drug-Drug Interactions"
              icon="💊"
              content={getField(drugData, 'drug_interactions')}
              fallback="No drug interaction data available"
            />
            <SafetyCard
              title="Drug-Food Interactions"
              icon="🍽️"
              content={getField(drugData, 'drug_food_interactions')}
              fallback="No drug-food interaction data available"
            />
            <SafetyCard
              title="Warnings & Risk Compounds"
              icon="🔴"
              content={getField(drugData, 'warnings')}
              fallback="No specific warnings available"
            />
            <SafetyCard
              title="Contraindications"
              icon="🚫"
              content={getField(drugData, 'contraindications')}
              fallback="No contraindications listed"
            />
            <SafetyCard
              title="Boxed Warnings"
              icon="📦"
              content={getField(drugData, 'boxed_warning')}
              fallback="No boxed warnings issued"
              isCritical={!!getField(drugData, 'boxed_warning')}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchView;
