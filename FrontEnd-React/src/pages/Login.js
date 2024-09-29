import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import loginImage from '../assets/Course app-pana.png'; 
import config from '../config/Config';
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // Importar ícones

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
      <div className="top-bar">
        <div className="logo" onClick={navigateToHome} style={{ cursor: 'pointer' }}>Conecta +</div>

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
                  <FaGoogle /> Login com Google
                </button>
              </li>
              <li>
                <button className="facebook-login">
                  <FaFacebook /> Login com Facebook
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;