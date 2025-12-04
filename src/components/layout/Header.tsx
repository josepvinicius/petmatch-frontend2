import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../../src/styles/components/header.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>Adote um Amigo</h1>
          </Link>
        </div>

        <nav className="nav-menu">
          <Link to="/">Home</Link>
          <Link to="/animais">Animais</Link>
          <Link to="/sobre">Sobre</Link>
          
          {user ? (
            <>
              {user.isAdmin && <Link to="/admin">Admin</Link>}
              <Link to="/perfil">Perfil</Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Entrar
              </Link>
              <Link to="/cadastro" className="btn btn-primary">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;