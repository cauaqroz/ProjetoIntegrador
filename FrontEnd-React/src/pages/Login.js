import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import loginImage from '../assets/Course app-pana.png'; 
import googleLogo from '../assets/image copy.png'; // Importe a imagem do logo do Google
import facebookLogo from '../assets/image copy 2.png'
import config from '../config/Config';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    let errorMessages = { ...errors };
    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        errorMessages[name] = 'Insira um email válido.';
      } else {
        delete errorMessages[name];
      }
    }
    if (name === 'password') {
      if (value.length < 6) {
        errorMessages[name] = 'A senha deve ter mais de 6 caracteres.';
      } else {
        delete errorMessages[name];
      }
    }
    setErrors(errorMessages);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(''); // Limpa o erro antes de tentar logar
    try {
      const response = await fetch(`${config.LocalApi}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('user', JSON.stringify(data)); 

        // Buscar perfil de freelancer
        const freelancerResponse = await fetch(`${config.LocalApi}/freelancers/${data.id}`);
        if (freelancerResponse.ok) {
          const freelancerData = await freelancerResponse.json();
          sessionStorage.setItem('freelancer', JSON.stringify(freelancerData)); 
        } else {
          sessionStorage.removeItem('freelancer'); 
        }

        navigate('/inicial', { state: { userId: data.id } }); // Passa o ID do usuário como estado na navegação
      } else {
        setError('Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro ao fazer login');
    }
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="wave-top">
        <svg viewBox="0 0 1440 320">
          <path fill="#ff820ede" fillOpacity="1" d="M0,96L48,106.7C96,117,192,139,288,138.7C384,139,480,117,576,122.7C672,128,768,160,864,176C960,192,1056,192,1152,186.7C1248,181,1344,171,1392,165.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
      <main className="login-main">
        <div className="image-login">
          <img src={loginImage} alt="Imagem de login" />
        </div>
        <div className="form-container login">
          <div className="form-box login">
            <h1>Login</h1>
            <ul className="social-login">
              <li>
                <button className="google-login">
                  <img src={googleLogo} alt="Google Logo" className="social-logo" /> Login com Google
                </button>
              </li>
              <li>
                <button className="facebook-login">
                  <img src={facebookLogo} alt="Facebook Logo" className="social-logo" /> Login com Facebook
                </button>
              </li>
            </ul>
            <div className="divider">ou</div>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
              <div>
                {errors.email && <p className="field-error">{errors.email}</p>}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className={errors.email ? 'input-error' : ''}
                />
              </div>
              <div>
                {errors.password && <p className="field-error">{errors.password}</p>}
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Senha"
                  className={errors.password ? 'input-error' : ''}
                />
              </div>
              <div className="remember-forgot">
                <label>
                  <input type="checkbox" className='lembrar-usuario'/> Lembrar usuário
                </label>
                <a href="/forgot-password">Esqueceu a senha?</a>
              </div>
              <button type="submit" className='login-btn'>Login</button>
            </form>
            <div className="no-account">
              Não possui conta? <a href="/register">Cadastre-se</a>
            </div>
          </div>
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

export default Login;