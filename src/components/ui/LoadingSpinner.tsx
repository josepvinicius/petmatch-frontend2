import React from 'react';
import '../../../src/styles/components/loading.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#4CAF50',
  message = 'Carregando...'
}) => {
  return (
    <div className="loading-container">
      <div 
        className={`spinner spinner-${size}`}
        style={{ borderTopColor: color }}
      />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
