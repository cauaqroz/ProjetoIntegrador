import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'; // Importe o CSS
import exampleImage from '../assets/Processing-pana.png'; // Importe a imagem

const Home = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  const navigateToRegister = () => {
    navigate('/register');
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setShowNotification(true);
      } else {
        setShowNotification(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Chama a função uma vez para definir o estado inicial

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className="home-container">
      {showNotification && (
        <div className="notification">
          <p>Baixe nosso aplicativo</p>
          <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">Ir para Play Store</a>
          <button onClick={closeNotification}>Fechar</button>
        </div>
      )}
      <div className="wave-top">
        <svg viewBox="0 0 1440 320">
          <path fill="#ff820ede" fillOpacity="1" d="M0,96L48,106.7C96,117,192,139,288,138.7C384,139,480,117,576,122.7C672,128,768,160,864,176C960,192,1056,192,1152,186.7C1248,181,1344,171,1392,165.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
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
      <div className="wave-bottom">
        <svg viewBox="0 0 1440 100">
          <path fill="#ff820ede" fillOpacity="1" d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,85.3C672,96,768,96,864,85.3C960,75,1056,53,1152,48C1248,43,1344,53,1392,58.7L1440,64L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Home;