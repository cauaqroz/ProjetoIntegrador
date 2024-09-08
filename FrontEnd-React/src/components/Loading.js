import React from 'react';
import '../styles/Loading.css'; // Importe o CSS para estilizar a tela de carregamento

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Carregando...</p>
    </div>
  );
};

export default Loading;