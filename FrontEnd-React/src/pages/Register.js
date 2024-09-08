import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'; 
import registerImage from '../assets/Research paper Customizable Flat Illustrations _ Rafiki Style.jpg'; 
import config from '../config/Config';
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    state: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validação de campo
    let errorMessages = { ...errors };
    if (name === 'name' || name === 'lastName' || name === 'country' || name === 'state') {
      if (value.length < 3) {
        errorMessages[name] = 'Mínimo de 3 caracteres.';
      } else {
        delete errorMessages[name];
      }
    }
    if (name === 'password') {
      if (value.length < 6) {
        errorMessages[name] = 'Mínimo de 6 caracteres.';
      } else {
        delete errorMessages[name];
      }
    }
    setErrors(errorMessages);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError(''); // Limpa o erro antes de tentar registrar
    try {
      const response = await fetch(`${config.LocalApi}/users`, { //endereço da API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        navigate('/login'); // Redireciona para a página de login após o registro
      } else if (response.status === 400) {
        const data = await response.text();
        if (data.includes('Email já cadastrado.')) {
          setError('Erro ao cadastrar usuário: E-mail já está em uso.');
        } else {
          setError(`Erro ao cadastrar usuário: ${data}`);
        }
      } else {
        setError('Erro ao cadastrar usuário.');
      }
    } catch (error) {
      setError('Erro ao cadastrar usuário.');
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
    <div className="register-container">
      <div className="top-bar">
        <div className="logo" onClick={navigateToHome} style={{ cursor: 'pointer' }} >Conecta +</div>
        <div className="header-buttons">
          <button onClick={navigateToLogin}>Login</button>
          <button onClick={navigateToRegister}>Cadastro</button>
        </div>
      </div>
      <main className="register-main">
        <div className="image-register">
          <img src={registerImage} alt="Imagem de cadastro" />
        </div>
        <div className="form-container">
          <div className="form-box">
            <h1>Cadastro</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleRegister}>
              <div>
                {errors.name && <p className="field-error">{errors.name}</p>}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength="3"
                  placeholder="Nome"
                  className={errors.name ? 'input-error' : ''}
                />
              </div>
              <div>
                {errors.lastName && <p className="field-error">{errors.lastName}</p>}
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  minLength="3"
                  placeholder="Sobrenome"
                  className={errors.lastName ? 'input-error' : ''}
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
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
                  minLength="6"
                  placeholder="Senha"
                  className={errors.password ? 'input-error' : ''}
                />
              </div>
              <div>
                {errors.country && <p className="field-error">{errors.country}</p>}
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  minLength="3"
                  placeholder="País"
                  className={errors.country ? 'input-error' : ''}
                />
              </div>
              <div>
                {errors.state && <p className="field-error">{errors.state}</p>}
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  minLength="3"
                  placeholder="Estado"
                  className={errors.state ? 'input-error' : ''}
                />
              </div>
              <button type="submit">Registrar</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;