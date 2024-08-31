import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/Perfil.css';

const Perfil = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [freelancer, setFreelancer] = useState(null);
  const [hours, setHours] = useState(0);
  const [rate, setRate] = useState(0);
  const [total, setTotal] = useState(0);

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
      <Sidebar />
      <div className="perfil-container">
        <Header onLogout={handleLogout} />
        <div className="perfil-content">
          <div className="perfil-feed">
            <div className="perfil-card">
              <h1>{user.name} {user.lastName}</h1>
              {freelancer ? (
                <>
                  <p><strong>Área de Atuação:</strong> {freelancer.areaOfExpertise}</p>
                  <p><strong>Descrição:</strong> {freelancer.description}</p>
                  <p><strong>País:</strong> {user.country} <strong>- Estado:</strong> {user.state}</p>
                  <p><strong>Portfólio:</strong> <a href={freelancer.portfolio} target="_blank" rel="noopener noreferrer">{freelancer.portfolio}</a>  <strong>- Email:</strong> <a href={`mailto:${user.email}`}>{user.email}</a></p>
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
            {freelancer ? (
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
            <h2>{freelancer ? 'Projetos Participando' : 'Projetos Criados'}</h2>
            <ul>
              {(freelancer ? user.projetosParticipando : user.projetosCriados).map(projeto => (
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

export default Perfil;