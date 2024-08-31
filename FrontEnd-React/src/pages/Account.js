import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/Account.css';

const Account = () => {
  const navigate = useNavigate();
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
      if (Object.keys(modifiedUserData).length > 0) {
        const userResponse = await axios.patch('http://localhost:2216/users/update', modifiedUserData, {
          headers: {
            'Content-Type': 'application/json',
            'userId': userId
          }
        });

        if (userResponse.status === 200) {
          alert('Informações do usuário atualizadas com sucesso!');
        } else {
          console.error('Erro ao atualizar informações do usuário:', userResponse.statusText);
        }
      }

      if (isFreelancer) {
        const modifiedFreelancerData = getModifiedFields(initialFreelancerData, freelancerData);
        if (Object.keys(modifiedFreelancerData).length > 0) {
          if (hasFreelancerProfile) {
            const freelancerResponse = await axios.patch('http://localhost:2216/users/freelancer/update', modifiedFreelancerData, {
              headers: {
                'Content-Type': 'application/json',
                'userId': userId
              }
            });

            if (freelancerResponse.status === 200) {
              alert('Perfil de freelancer atualizado com sucesso!');
            } else {
              console.error('Erro ao atualizar perfil de freelancer:', freelancerResponse.statusText);
            }
          } else {
            const freelancerResponse = await axios.post('http://localhost:2216/users/freelancer', freelancerData, {
              headers: {
                'Content-Type': 'application/json',
                'userId': userId
              }
            });

            if (freelancerResponse.status === 200) {
              alert('Perfil de freelancer cadastrado com sucesso!');
              setHasFreelancerProfile(true);
            } else {
              console.error('Erro ao cadastrar perfil de freelancer:', freelancerResponse.statusText);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao salvar informações:', error);
      if (error.response) {
        console.error('Dados da resposta de erro:', error.response.data);
        console.error('Status da resposta de erro:', error.response.status);
        console.error('Cabeçalhos da resposta de erro:', error.response.headers);
      }
    }
  };

  return (
    <div className="account-page">
      <Sidebar activeTab="/account" />
      <div className="main-content">
        <Header onLogout={handleLogout} />
        <div className="account-content">
          <h2>Configurações da Conta</h2>
          <form onSubmit={handleSave}>
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
            <div className="checkbox-container">
              <label>
                <input type="checkbox" checked={isFreelancer} onChange={() => setIsFreelancer(!isFreelancer)} />
                Cadastrar como Freelancer
              </label>
            </div>
            {isFreelancer && (
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
            )}
            <button type="submit">Salvar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;