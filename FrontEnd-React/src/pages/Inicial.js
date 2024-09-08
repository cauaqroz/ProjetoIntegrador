import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import defaultImage from '../assets/baixados.png'; 
import config from '../config/Config';
import '../styles/Inicial.css'; 

const Inicial = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [freelancer, setFreelancer] = useState(null);
  const [userId, setUserId] = useState(location.state?.userId || null);
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [hours, setHours] = useState(0);
  const [rate, setRate] = useState(0);
  const [total, setTotal] = useState(0);
  const [visibleProjects, setVisibleProjects] = useState(8); // Estado para controlar a quantidade de projetos visíveis
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const freelancerData = JSON.parse(sessionStorage.getItem('freelancer'));
    if (userData) {
      setUser(userData);
    }
    if (freelancerData) {
      setFreelancer(freelancerData);
    }
  }, []);

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const response = await axios.get(`${config.LocalApi}/projetos`);
        setProjetos(response.data.reverse()); // Inverte a lista de projetos
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjetos();
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleSearchChange = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (isSearchActive && term) {
      try {
        const response = await axios.get(`${config.LocalApi}/projetos/buscarProjetos?titulo=${term}`);
        setSearchResults(response.data.reverse()); // Inverte a lista de resultados de busca
      } catch (err) {
        setError(err);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleCalculate = () => {
    setTotal(hours * rate);
  };

  const handleProjetoClick = (id) => {
    navigate(`/detalhes-projeto/${id}`);
  };

  const handleLoadMore = () => {
    setVisibleProjects((prevVisibleProjects) => prevVisibleProjects + 8);
  };

  const projetosToDisplay = searchTerm ? searchResults : projetos;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="container">
        <Header onLogout={handleLogoutClick} onSearchChange={handleSearchChange} onSearchFocus={handleSearchFocus} />
        <div className="feed">
          {loading ? (
            <p>Carregando projetos...</p>
          ) : error ? (
            <p>Erro ao carregar os projetos: {error.message}</p>
          ) : (
            <div style={{ paddingTop: '60px' }}>
              {projetosToDisplay.slice(0, visibleProjects).map(projeto => (
                <div key={projeto.id} className="card" onClick={() => handleProjetoClick(projeto.id)}>
                  <img src={projeto.capaUrl ? `${config.LocalApi}/projetos/${projeto.id}/capa` : defaultImage} alt="Capa do Projeto" />
                  <h1>{projeto.titulo}</h1>
                  <p><strong>Descrição:</strong> {projeto.descricao}</p>
                  <p><strong>Tecnologia:</strong> {projeto.tecnologia}</p>
                </div>
              ))}
              {visibleProjects < projetosToDisplay.length && (
                <div className="load-more" onClick={handleLoadMore}>
                  <span className="line"></span>
                  <span className="text">Exibir Mais</span>
                  <span className="line"></span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="initial-payments-feed">
          {freelancer ? (
            <div className="initial-payments-card">
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
            <div className="initial-payments-card">
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
          <div className="initial-anuncio-card">
            <h2>Anúncio</h2>
            <p>Este é um espaço para anúncios.</p>
          </div>
        </div>
      </div>
      {showLogoutModal && (
        <LogoutModal onConfirm={handleConfirmLogout} onCancel={handleCancelLogout} />
      )}
    </div>
  );
};
const LogoutModal = ({ onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Você deseja sair?</h2>
      <div className="modal-buttons">
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  </div>
);
export default Inicial;