import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import config from '../config/Config';
import '../styles/Account.css';

const Account = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('perfil');
  const [initialUserData, setInitialUserData] = useState({});
  const [userData, setUserData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    state: ''
  });
  const [initialFreelancerData, setInitialFreelancerData] = useState({});
  const [freelancerData, setFreelancerData] = useState({
    description: '',
    portfolio: '',
    education: '',
    areaOfExpertise: ''
  });
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [userId, setUserId] = useState(null);
  const [hasFreelancerProfile, setHasFreelancerProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [backendMessage, setBackendMessage] = useState(''); // Novo estado para armazenar a mensagem do backend

  // Novos estados para as preferências do usuário
  const [darkMode, setDarkMode] = useState(false);
  const [disableFriendRequests, setDisableFriendRequests] = useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const freelancer = JSON.parse(sessionStorage.getItem('freelancer'));

    if (user) {
      setInitialUserData({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        password: '',
        country: user.country,
        state: user.state
      });
      setUserId(user.id);
      setProfileImageUrl(`${config.LocalApi}/users/avatar/${user.avatar}`);
      // Carregar preferências do usuário
      setDarkMode(user.darkMode || false);
      setDisableFriendRequests(user.disableFriendRequests || false);
    }

    if (freelancer) {
      setInitialFreelancerData({
        description: freelancer.description,
        portfolio: freelancer.portfolio,
        education: freelancer.education,
        areaOfExpertise: freelancer.areaOfExpertise
      });
      setIsFreelancer(true);
      setHasFreelancerProfile(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFreelancerChange = (event) => {
    const { name, value } = event.target;
    setFreelancerData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  
    if (file) {
      const confirmUpdate = window.confirm('Você deseja atualizar sua imagem de perfil?');
      if (!confirmUpdate) {
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const imageResponse = await axios.post(`${config.LocalApi}/users/uploadAvatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'userId': userId
          }
        });
  
        if (imageResponse.status === 200) {
          const newAvatar = imageResponse.data.avatarId;
          setProfileImageUrl(`${config.LocalApi}/users/avatar/${newAvatar}`);
  
          // Atualizar o campo avatar no sessionStorage
          const updatedUser = { ...JSON.parse(sessionStorage.getItem('user')), avatar: newAvatar };
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
  
          // Mostrar a mensagem do backend na tela
          setBackendMessage(`Avatar atualizado com sucesso. A mudança será aplicada na próxima vez que você entrar na plataforma. ID: ${newAvatar}`);
          console.log('Avatar atualizado com sucesso:', newAvatar);
        } else {
          console.error('Erro ao fazer upload da imagem:', imageResponse.statusText);
        }
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        if (error.response) {
          console.error('Erro:', error.response.data);
        }
      }
    }
  };

  const handlePreferenceChange = (event) => {
    const { name, checked } = event.target;
    if (name === 'darkMode') {
      setDarkMode(checked);
    } else if (name === 'disableFriendRequests') {
      setDisableFriendRequests(checked);
    }
  };

  const getModifiedFields = (initialData, currentData) => {
    const modifiedFields = {};
    for (const key in currentData) {
      if (currentData[key] && currentData[key] !== initialData[key]) {
        modifiedFields[key] = currentData[key];
      }
    }
    return modifiedFields;
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const modifiedUserData = getModifiedFields(initialUserData, userData);
      modifiedUserData.darkMode = darkMode;
      modifiedUserData.disableFriendRequests = disableFriendRequests;

      if (Object.keys(modifiedUserData).length > 0) {
        const userResponse = await axios.patch(`${config.LocalApi}/users/update`, modifiedUserData, {
          headers: {
            'Content-Type': 'application/json',
            'userId': userId
          }
        });

        if (userResponse.status === 200) {
          // Atualizar dados do usuário no sessionStorage
          sessionStorage.setItem('user', JSON.stringify(userResponse.data));
        } else {
          console.error('Erro ao atualizar usuário:', userResponse.statusText);
        }
      }

      if (isFreelancer) {
        const modifiedFreelancerData = getModifiedFields(initialFreelancerData, freelancerData);
        if (Object.keys(modifiedFreelancerData).length > 0) {
          const freelancerResponse = await axios.patch(`${config.LocalApi}/freelancers/update`, modifiedFreelancerData, {
            headers: {
              'Content-Type': 'application/json',
              'userId': userId
            }
          });

          if (freelancerResponse.status === 200) {
            // Atualizar dados do freelancer no sessionStorage
            sessionStorage.setItem('freelancer', JSON.stringify(freelancerResponse.data));
          } else {
            console.error('Erro ao atualizar freelancer:', freelancerResponse.statusText);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao salvar informações:', error);
      if (error.response) {
        console.error('Erro:', error.response.data);
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(`${config.LocalApi}/users/delete`, {
        headers: {
          'Content-Type': 'application/json',
          'userId': userId
        }
      });

      if (response.status === 200) {
        sessionStorage.clear();
        navigate('/login');
      } else {
        console.error('Erro ao deletar conta:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
    }
  };

  const handleDeleteFreelancerProfile = async () => {
    try {
      const response = await axios.delete(`${config.LocalApi}/freelancers/delete`, {
        headers: {
          'Content-Type': 'application/json',
          'userId': userId
        }
      });

      if (response.status === 200) {
        sessionStorage.removeItem('freelancer');
        setIsFreelancer(false);
        setHasFreelancerProfile(false);
      } else {
        console.error('Erro ao deletar perfil de freelancer:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao deletar perfil de freelancer:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div>
            <div className="settings-image-container">
              <img src={profileImageUrl} alt="Imagem de Perfil" className="settings-image" />
              <label htmlFor="profileImage" className="edit-icon">
                <span className="material-symbols-outlined trocarImg">edit</span>
              </label>
              <input type="file" id="profileImage" name="profileImage" onChange={handleImageChange} style={{ display: 'none' }} />
            </div>
            <div>
              <label>Nome:</label>
              <input type="text" name="name" value={userData.name} placeholder={initialUserData.name} onChange={handleUserChange} />
            </div>
            <div>
              <label>Sobrenome:</label>
              <input type="text" name="lastName" value={userData.lastName} placeholder={initialUserData.lastName} onChange={handleUserChange} />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" name="email" value={userData.email} placeholder={initialUserData.email} onChange={handleUserChange} />
            </div>
            <div>
              <label>Senha:</label>
              <input type="password" name="password" value={userData.password} placeholder="********" onChange={handleUserChange} />
            </div>
            <div>
              <label>País:</label>
              <input type="text" name="country" value={userData.country} placeholder={initialUserData.country} onChange={handleUserChange} />
            </div>
            <div>
              <label>Estado:</label>
              <input type="text" name="state" value={userData.state} placeholder={initialUserData.state} onChange={handleUserChange} />
            </div>
          </div>
        );
      case 'freelancer':
        return (
          <>
            <div>
              <label>Descrição:</label>
              <textarea name="description" value={freelancerData.description} placeholder={initialFreelancerData.description} onChange={handleFreelancerChange}></textarea>
            </div>
            <div>
              <label>Portfólio:</label>
              <input type="text" name="portfolio" value={freelancerData.portfolio} placeholder={initialFreelancerData.portfolio} onChange={handleFreelancerChange} />
            </div>
            <div>
              <label>Educação:</label>
              <input type="text" name="education" value={freelancerData.education} placeholder={initialFreelancerData.education} onChange={handleFreelancerChange} />
            </div>
            <div>
              <label>Área de Especialização:</label>
              <input type="text" name="areaOfExpertise" value={freelancerData.areaOfExpertise} placeholder={initialFreelancerData.areaOfExpertise} onChange={handleFreelancerChange} />
            </div>
          </>
        );
      case 'settings':
        return (
          <div>
            <h3>Configurações</h3>
            <div className="checkbox-container">
              <input type="checkbox" id="darkMode" name="darkMode" checked={darkMode} onChange={handlePreferenceChange} />
              <label htmlFor="darkMode">Modo Dark</label>
            </div>
            <div className="checkbox-container">
              <input type="checkbox" id="disableFriendRequests" name="disableFriendRequests" checked={disableFriendRequests} onChange={handlePreferenceChange} />
              <label htmlFor="disableFriendRequests">Não receber solicitações de amizade</label>
            </div>
          </div>
        );
      case 'account':
        return (
          <div>
            <h3>Conta</h3>
            <button type="button" onClick={handleDeleteAccount}>Deletar Conta</button>
            {isFreelancer && (
              <button type="button" onClick={handleDeleteFreelancerProfile}>Deletar Perfil de Freelancer</button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="account-page">
      <Sidebar activeTab="/account" />
      <div className="main-content">
        <Header onLogout={handleLogout} />
        <div className="account-content">
          <h2>Configurações da Conta</h2>
          <div className="tabs">
            <button onClick={() => setActiveTab('perfil')} className={activeTab === 'perfil' ? 'active' : ''}>Perfil</button>
            <button onClick={() => setActiveTab('freelancer')} className={activeTab === 'freelancer' ? 'active' : ''}>Freelancer</button>
            <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'active' : ''}>Settings</button>
            <button onClick={() => setActiveTab('account')} className={activeTab === 'account' ? 'active' : ''}>Account</button>
          </div>
          <form onSubmit={handleSave}>
            {renderTabContent()}
            <button type="submit">Salvar</button>
          </form>
          {backendMessage && <p>{backendMessage}</p>} {/* Mostrar a mensagem do backend */}
        </div>
      </div>
    </div>
  );
};

export default Account;