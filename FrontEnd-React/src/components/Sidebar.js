import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ activeTab }) => {
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(location.pathname);

  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);

  return (
    <div className="sidebar">
      <h2>Navegação</h2>
      <ul>
        <li className={currentTab === "/inicial" ? "active" : ""}>
          <Link to="/inicial" onClick={() => setCurrentTab("/inicial")}>
            Inicial
          </Link>
        </li>
        <li className={currentTab === "/projetos" ? "active" : ""}>
          <Link to="/projetos" onClick={() => setCurrentTab("/projetos")}>
            Projetos
          </Link>
        </li>
        <li className={currentTab === "/Perfil" ? "active" : ""}>
          <Link to="/Perfil" onClick={() => setCurrentTab("/Perfil")}>
            Perfil
          </Link>
        </li>
        <li className={currentTab === "/configuracoes" ? "active" : ""}>
          <Link
            to="/configuracoes"
            onClick={() => setCurrentTab("/configuracoes")}
          >
            Configurações
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
