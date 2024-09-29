import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import config from '../config/Config';
import '../styles/Updates.css';

const Updates = () => {
  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get(`${config.LocalApi}/updates`);
        const updates = response.data;
        if (updates.length > 0) {
          setUpdate(updates[0]); // Pega a última atualização
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar activeTab="/updates" />
      <div className="container">
        <Header />
        <div className="updates-content">
          {loading ? (
            <p>Carregando atualizações...</p>
          ) : error ? (
            <p>Erro ao carregar as atualizações: {error.message}</p>
          ) : update ? (
            <div className="update-item">
              <h3>Autor: {update.author}</h3>
              <h2>{update.title}</h2>
              <p>{update.content}</p>
              <span>{new Date(update.createdDate).toLocaleString()}</span>
            </div>
          ) : (
            <p>Nenhuma atualização encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Updates;