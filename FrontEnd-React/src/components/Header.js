import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Header.css'; // Importe o arquivo CSS para estilizar o cabeçalho

const Header = ({ onLogout, onSearchChange, onSearchFocus }) => {
  const location = useLocation();
  
  // Defina os títulos das páginas com base na rota
  const pageTitles = {
    '/inicial': 'Inicial',
    '/perfil': 'Perfil',
    '/projetos': 'Projetos',
    '/detalhes-projeto': 'Detalhes do Projeto'
  };

  // Obtenha o título da página atual
  const pageTitle = pageTitles[location.pathname] || 'Página';

  return (
    <div className="header">
      <h1>{pageTitle}</h1>
      <div className="header-right">
        <input
          type="text"
          placeholder="Pesquisar..."
          className="search-bar"
          onChange={onSearchChange} // Adicione o evento onChange
          onFocus={onSearchFocus} // Adicione o evento onFocus
        />
        <button onClick={onLogout} className="logout-button">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </div>
  );
};

export default Header;