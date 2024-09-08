import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'; // Substituir useHistory por useNavigate
import axios from 'axios';
import config from '../config/Config';
import '../styles/Header.css';

const Header = ({ onLogout, onSearchChange, onSearchFocus, selectedProjeto, openChannelId }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Substituir useHistory por useNavigate
  const [userAvatar, setUserAvatar] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user && user.avatar) {
        try {
          const response = await axios.get(`${config.LocalApi}/users/avatar/${user.avatar}`, {
            responseType: 'blob'
          });
          if (response.status === 200) {
            const imageUrl = URL.createObjectURL(response.data);
            setUserAvatar(imageUrl);
          }
        } catch (error) {
          console.error('Erro ao buscar imagem de perfil:', error);
        }
      }
    };

    fetchUserAvatar();
  }, []);

  const fetchNotifications = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) return;

    try {
      const response = await axios.get(`${config.LocalApi}/notifications`, {
        headers: {
          'userId': user.id
        }
      });

      if (response.status === 200) {
        const data = response.data;
        const previousNotifications = JSON.parse(sessionStorage.getItem('NoNotify')) || [];

        const newNotifications = data.filter(notification => 
          !previousNotifications.some(prev => prev.createdDate === notification.createdDate)
        );

        if (newNotifications.length > 0) {
          const notificationsWithProjectTitles = await Promise.all(newNotifications.map(async (notification) => {
            try {
              const projectResponse = await axios.get(`${config.LocalApi}/projetos/notify/${notification.channelId}`);
              if (projectResponse.status === 200) {
                return { ...notification, projectTitle: projectResponse.data.titulo };
              }
            } catch (error) {
              console.error('Erro ao buscar dados do projeto:', error);
            }
            return notification;
          }));

          setNotifications(prevNotifications => [...notificationsWithProjectTitles, ...prevNotifications]);

          sessionStorage.setItem('NoNotify', JSON.stringify(data));
        }
      } else {
        console.error('Erro ao buscar notificações:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [selectedProjeto]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Filtrar notificações que não pertencem ao projeto atualmente aberto no chat
  const filteredNotifications = notifications.filter(notification => 
    !(selectedProjeto && notification.channelId === selectedProjeto.chatId)
  );

  const handleNewProjectClick = () => {
    navigate('/newProject'); // Substituir history.push por navigate
  };

  return (
    <div className="header">
      <div className="header-left">
        <div className="search-container">
          <span className="search-icon material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Buscar Projetos..."
            className="search-bar"
            onChange={onSearchChange}
            onFocus={onSearchFocus}
          />
        </div>
      </div>
      <button onClick={handleNewProjectClick} className="new-project-button">
        Novo
      </button>
      <div className="header-right">
        <div className="notification-container">
          <button className="notification-button" onClick={toggleDropdown}>
            <span className="material-symbols-outlined">notifications</span>
            {filteredNotifications.length > 0 && <span className="notification-dot"></span>}
          </button>
          {dropdownVisible && (
            <div className="notification-dropdown">
              <div className="notification-content">
                {filteredNotifications.map((notification, index) => (
                  <div key={index} className="notification-item">
                    <p><strong>{notification.projectTitle || 'Projeto desconhecido'}</strong>: {notification.content}</p>
                    <span>{new Date(notification.createdDate).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="profile-circle">
          {userAvatar ? (
            <Link to="/perfil">
              <img src={userAvatar} alt="Avatar" className="profile-image" />
            </Link>
          ) : (
            <span className="material-symbols-outlined">account_circle</span>
          )}
        </div>
        <button onClick={onLogout} className="logout-button">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </div>
  );
};

export default Header;