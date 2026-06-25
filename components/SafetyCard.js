import React from 'react';
import '../styles/SearchView.css';

function SafetyCard({ title, icon, content, fallback, isCritical }) {
  const hasContent = content && content.length > 0;

  return (
    <div className={`safety-card ${isCritical ? 'critical' : ''}`}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h4>{title}</h4>
      </div>
      <div className="card-content">
        {hasContent ? (
          <p>{content}</p>
        ) : (
          <p className="fallback-text">{fallback}</p>
        )}
      </div>
    </div>
  );
}

export default SafetyCard;
