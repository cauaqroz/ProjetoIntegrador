import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css'; 

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
      <h2>ConectaPlus</h2>
      <div className="menu-section">
        <h5>Menu</h5>
        <ul>
          <li className={currentTab === '/inicial' ? 'active' : ''}>
            <Link to="/inicial" onClick={() => setCurrentTab('/inicial')}>Home</Link>
          </li>
          <li className={currentTab === '/projetos' ? 'active' : ''}>
            <Link to="/projetos" onClick={() => setCurrentTab('/projetos')}>Projects</Link>
          </li>
          <li className={currentTab === '/updates' ? 'active' : ''}>
            <Link to="/updates" onClick={() => setCurrentTab('/updates')}>Updates</Link>
          </li>
        </ul>
      </div>
      <div className="social-section">
        <h5>Social</h5>
        <ul>
          <li className={currentTab === '/perfil' ? 'active' : ''}>
            <Link to="/perfil" onClick={() => setCurrentTab('/perfil')}>Profile</Link>
          </li>
          <li className={currentTab === '/peoples' ? 'active' : ''}>
            <Link to="/peoples" onClick={() => setCurrentTab('/peoples')}>Peoples</Link>
          </li>
        </ul>
      </div>
      <div className="general-section">
        <h5>General</h5>
        <ul>
          <li className={currentTab === '/account' ? 'active' : ''}>
            <Link to="/account" onClick={() => setCurrentTab('/account')}>Setting</Link>
          </li>
        </ul>
      </div>
      <div className="add-project">
        <Link to="/newproject">
          Novo
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;