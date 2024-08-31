import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import loginImage from '../assets/LoginImg.jpeg'; 

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
      const response = await fetch('http://localhost:2216/users/login', {
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
        const freelancerResponse = await fetch(`http://localhost:2216/users/${data.id}/freelancer`);
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

  const navigateToRegister = () => {
    navigate('/register');
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="top-bar">
        <div className="logo" onClick={navigateToHome} style={{ cursor: 'pointer' }}>Conecta +</div>
        <div className="header-buttons">
          <button onClick={navigateToLogin}>Login</button>
          <button onClick={navigateToRegister}>Cadastro</button>
        </div>
      </div>
      <main className="login-main">
        <div className="form-container">
          <div className="form-box">
            <h1>Login</h1>
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
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
        <div className="image-login">
          <img src={loginImage} alt="Imagem de login" />
        </div>
      </main>
    </div>
  );
};

export default Login;