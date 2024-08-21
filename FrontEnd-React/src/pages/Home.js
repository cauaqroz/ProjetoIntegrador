import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'; // Importe o CSS

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
      <h1>Bem-vindo à nossa plataforma de freelancer</h1>
      <p>Aqui você pode encontrar os melhores freelancers para o seu projeto.</p>
      <button onClick={navigateToRegister}>Cadastro</button>
      <button onClick={navigateToLogin}>Login</button>
    </div>
  );
};

export default Home;