import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'; // Importe o CSS
import exampleImage from '../assets/Processing-pana.png'; // Importe a imagem

const Home = () => {
  const navigate = useNavigate();

  const navigateToRegister = () => {
    navigate('/register');
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="top-bar">
        <div className="logo">Conecta +</div>
      </div>
      <main className="home-main">
        <div className="text-container">
          <h1 className="main-title">ConectaPlus</h1>
          <h2 className="main-subtitle">Conecte-se a Projetos Incríveis!</h2>
          <p className="main-description">
            Uma nova plataforma, que busca trazer sempre o melhor de seus profissionais, buscando sempre o próximo desafio e criando oportunidades, bem-vindo a <strong>Conecta</strong> a mais nova plataforma para freelancer.
          </p>
          <button className="get-started-button" onClick={navigateToRegister}>Vamos Começar</button>
        </div>
        <div className="image-home">
          <img src={exampleImage} alt="Imagem de exemplo" />
        </div>
      </main>
    </div>
  );
};

export default Home;