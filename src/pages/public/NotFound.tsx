// src/pages/public/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../../src/styles/pages/not-found.css';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>A página que você está procurando não existe.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            Voltar para Home
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;