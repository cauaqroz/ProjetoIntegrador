import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Inicial = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(location.state?.userId || null); // Recupera o ID do usuário do estado passado na navegação
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const response = await axios.get('http://localhost:2216/projetos');
        setProjetos(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjetos();
  }, []);

  if (!user) return <p>Carregando...</p>;
  if (loading) return <p>Carregando projetos...</p>;
  if (error) return <p>Erro ao carregar os projetos: {error.message}</p>;

  return (
    <div>
      <h1>Bem-vindo, {user.name} {user.lastName}</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>País:</strong> {user.country}</p>
      <p><strong>Estado:</strong> {user.state}</p>
      <p><strong>ID do Usuário:</strong> {userId}</p> {/* Exibe o ID do usuário */}
      
      <h2>Projetos</h2>
      {projetos.map(projeto => (
        <div key={projeto.id} style={{ border: '1px solid #ccc', padding: '16px', margin: '16px 0' }}>
          <h1>{projeto.titulo}</h1>
          <p><strong>Descrição:</strong> {projeto.descricao}</p>
          <p><strong>Tecnologia:</strong> {projeto.tecnologia}</p>
          {projeto.capaUrl && <img src={`http://localhost:2216/projetos/${projeto.id}/capa`} alt="Capa do Projeto" style={{ width: '100%', height: 'auto' }} />}
        </div>
      ))}
    </div>
  );
};

export default Inicial;