import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultImage from '../assets/baixados.png'; // Importe a imagem

const Projeto = () => {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar os projetos: {error.message}</p>;

  return (
    <div>
      {projetos.map(projeto => (
        <div key={projeto.id} style={{ border: '1px solid #ccc', padding: '16px', margin: '16px 0' }}>
          <img 
            src={projeto.capaUrl ? `http://localhost:2216/projetos/${projeto.id}/capa` : defaultImage} 
            alt="Capa do Projeto" 
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} 
          />
          <h1>{projeto.titulo}</h1>
          <p><strong>Descrição:</strong> {projeto.descricao}</p>
          <p><strong>Tecnologia:</strong> {projeto.tecnologia}</p>
        </div>
      ))}
    </div>
  );
};

export default Projeto;