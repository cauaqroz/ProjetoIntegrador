import React from "react";
import { useLocation } from "react-router-dom";
import "../styles/Header.css";

const Header = ({ onLogout, onSearchChange, onSearchFocus }) => {
  const location = useLocation();

  const pageTitles = {
    "/inicial": "Inicial",
    "/perfil": "Perfil",
    "/projetos": "Projetos",
    "/detalhes-projeto": "Detalhes do Projeto",
  };

  const pageTitle = pageTitles[location.pathname] || "Página";

  return (
    <div className="header">
      <h1>{pageTitle}</h1>
      <div className="header-right">
        <input
          type="text"
          placeholder="Pesquisar..."
          className="search-bar"
          onChange={onSearchChange}
          onFocus={onSearchFocus}
        />
        <button onClick={onLogout} className="logout-button">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
