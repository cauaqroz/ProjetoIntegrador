import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultImage from '../assets/baixados.png'; // Importe a imagem
import Sidebar from '../components/Sidebar'; // Importe a Sidebar
import Header from '../components/Header'; // Importe o Header
import '../styles/DetalhesProjeto.css'; // Importe o CSS
import config from '../config/Config'; // Importe o arquivo de configuração

const DetalhesProjeto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [userId, setUserId] = useState(null); // Estado para armazenar o ID do usuário
  const [isRequestDisabled, setIsRequestDisabled] = useState(false); // Estado para desabilitar o botão

  useEffect(() => {
    // Recuperar o ID do usuário do sessionStorage
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
    }

    const fetchProjeto = async () => {
      try {
        const response = await axios.get(`${config.LocalApi}/projetos/${id}`);
        setProjeto(response.data);

        if (response.data.approvedParticipants) {
          const participantesPromises = response.data.approvedParticipants.map(async (participanteId) => {
            const participanteResponse = await axios.get(`${config.LocalApi}/users/${participanteId}`);
            return participanteResponse.data;
          });

          const participantesData = await Promise.all(participantesPromises);
          setParticipantes(participantesData);
        }

        // Verificar se o usuário já solicitou ou foi aprovado ou é o criador do projeto
        const isUserInLists = response.data.participationRequests.includes(storedUser.id) || 
                              response.data.approvedParticipants.includes(storedUser.id) ||
                              response.data.criador.id === storedUser.id;
        setIsRequestDisabled(isUserInLists);

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjeto();
  }, [id]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };
  const handleNewProjectClick = () => {
    navigate('/newProject');
  };


  const handleRequestParticipation = async () => {
    try {
      const response = await axios.post(`${config.LocalApi}/projetos/${id}/solicitarParticipacao`, {}, {
        headers: {
          'userId': userId
        }
      });
      if (response.status === 200) {
        alert('Solicitação enviada com sucesso!');
      } else {
        alert('Erro ao enviar solicitação.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar solicitação.');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar o projeto: {error.message}</p>;

  return (
    <div className="detalhes-projeto" style={{ display: 'flex' }}>
      <Sidebar activeTab="/projetos" />
      <div className="container">
        <Header onLogout={handleLogout} />
        <div className="project-card">
          <img 
            src={projeto.capaUrl ? `${config.LocalApi}/projetos/${projeto.id}/capa` : defaultImage} 
            alt="Capa do Projeto" 
          />
          <h1>{projeto.titulo}</h1>
          <button className="request-button" onClick={handleRequestParticipation} disabled={isRequestDisabled}>
            Solicitar Participação
          </button>
        </div>
        <div className="project-details">
          <p><strong>Descrição:</strong> {projeto.descricao}</p>
          <p><strong>Tecnologia:</strong> {projeto.tecnologia}</p>
          <p><strong>Criador:</strong> {projeto.criador.name} {projeto.criador.lastName}</p>
          <p><strong>Email Criador:</strong> <a href={`mailto:${projeto.criador.email}`}>{projeto.criador.email}</a></p>
          <p><strong>País:</strong> {projeto.criador.country} <strong>- Estado:</strong> {projeto.criador.state}</p>
        </div>
        {participantes.length > 0 && (
          <div className="participantes-card">
            <h2>Inscritos</h2>
            <ul>
              {participantes.map(participante => (
                <li key={participante.id} className="participante-item">
                  <div className="participante-card">
                    <p><strong>{participante.name} {participante.lastName}</strong></p>
                    <p><strong>Email:</strong> <a href={`mailto:${participante.email}`}>{participante.email}</a></p>
                    <p><strong>País:</strong> {participante.country} <strong>- Estado:</strong> {participante.state}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button className="floating-button" onClick={handleNewProjectClick}>+</button>
    </div>
    
  );
};

export default DetalhesProjeto;