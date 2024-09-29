import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import config from '../config/Config';
import '../styles/Perfil.css';
import '../styles/PerfTerceiros.css';

const PerfilTerceiros = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [hours, setHours] = useState(0);
  const [rate, setRate] = useState(0);
  const [total, setTotal] = useState(0);
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${config.LocalApi}/users/email/${email}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);

          // Verificar se o usuário é um freelancer
          if (data.portfolio) {
            setIsFreelancer(true);
          }

          // Fetch user avatar
          if (data.avatar) {
            try {
              const avatarResponse = await axios.get(`${config.LocalApi}/users/avatar/${data.avatar}`, {
                responseType: 'blob'
              });
              if (avatarResponse.status === 200) {
                const imageUrl = URL.createObjectURL(avatarResponse.data);
                setUserAvatar(imageUrl);
              }
            } catch (error) {
              console.error('Erro ao buscar imagem de perfil:', error);
            }
          }
        } else {
          console.error('Erro ao buscar dados do usuário');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário', error);
      }
    };

    fetchUserData();
  }, [email]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const handleCalculate = () => {
    setTotal(hours * rate);
  };

  const handleProjetoClick = (id) => {
    navigate(`/detalhes-projeto/${id}`);
  };

  if (!user) return <p>Carregando...</p>;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar activeTab="/friends" />
      <div className="perfil-container">
        <Header onLogout={handleLogout} />
        <div className="perfil-content">
          <div className="perfil-feed">
            <div className="perfil-card" style={{ backgroundImage: `url(${userAvatar})` }}>
              <div className="perfil-header">
                <h1>{user.name} {user.lastName}</h1>
              </div>
              {isFreelancer ? (
                <>
                  <p><strong>Área de Atuação:</strong> {user.areaOfExpertise}</p>
                  <p><strong>Descrição:</strong> {user.description}</p>
                  <p><strong>País:</strong> {user.country} <strong>- Estado:</strong> {user.state}</p>
                  <p><strong>Portfólio:</strong> <a href={user.portfolio} target="_blank" rel="noopener noreferrer">{user.portfolio}</a>  <strong>- Email:</strong> <a href={`mailto:${user.email}`}>{user.email}</a></p>
                </>
              ) : (
                <>
                  <p><strong>Email:</strong> <a href={`mailto:${user.email}`}>{user.email}</a></p>
                  <p><strong>País:</strong> {user.country} <strong>- Estado:</strong> {user.state}</p>
                </>
              )}
            </div>
          </div>
          <div className="payments-feed">
            {isFreelancer ? (
              <div className="payments-card">
                <h2>Simular Valor do Freelancer</h2>
                <div>
                  <label>Horas Trabalhadas:</label>
                  <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
                </div>
                <div>
                  <label>Taxa por Hora:</label>
                  <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
                </div>
                <button onClick={handleCalculate}>Calcular</button>
                <p>Total: {total}</p>
              </div>
            ) : (
              <div className="payments-card">
                <h2>Calcular Custo do Projeto</h2>
                <div>
                  <label>Horas Trabalhadas:</label>
                  <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
                </div>
                <div>
                  <label>Taxa por Hora:</label>
                  <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
                </div>
                <button onClick={handleCalculate}>Calcular</button>
                <p>Total: {total}</p>
              </div>
            )}
            <div className="anuncio-card">
              <h2>Anúncio</h2>
              <p>Este é um espaço para anúncios.</p>
            </div>
          </div>
        </div>
        <div className="projetos-feed">
          <div className="projetos-card">
            <h2>{isFreelancer ? 'Projetos Participando' : 'Projetos Criados'}</h2>
            <ul>
              {(isFreelancer ? user.projetosParticipando : user.projetosCriados)?.map(projeto => (
                <li key={projeto.id} className="projeto-item" onClick={() => handleProjetoClick(projeto.id)}>
                  <div className="projeto-card">
                    <p><strong>{projeto.titulo}</strong> </p>
                    <p>{projeto.descricao}</p>
                    <p><strong>Tecnologia:</strong> {projeto.tecnologia}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilTerceiros;