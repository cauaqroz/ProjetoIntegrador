import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'; 
import registerImage from '../assets/Design tools-pana.png'; 
import config from '../config/Config';
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // Importar ícones

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
    if (name === 'name' || name === 'lastName') {
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
        
      </div>
      <main className="register-main">
        <div className="image-register">
          <img src={registerImage} alt="Imagem de cadastro" />
        </div>
        <div className="form-container register">
          <div className="form-box register">
            <h1>Cadastro</h1>
            <ul className="social-register">
              <li>
                <button className="google-register">
                  <FaGoogle /> Cadastro com Google
                </button>
              </li>
              <li>
                <button className="facebook-register">
                  <FaFacebook /> Cadastro com Facebook
                </button>
              </li>
            </ul>
            <div className="divider">ou</div>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleRegister}>
  <div className="name-lastname">
    <div className="form-group">
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
    <div className="form-group">
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
  </div>
  <div className="form-group">
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
      placeholder="Email"
    />
  </div>
  <div className="form-group">
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
  <div className="country-state">
    <div className="form-group">
      {errors.country && <p className="field-error">{errors.country}</p>}
      <select
        name="country"
        value={formData.country}
        onChange={handleChange}
        required
        className={errors.country ? 'input-error' : ''}
      >
        <option value="">País....</option>
        <option value="Brasil">Brasil</option>
        <option value="Estados Unidos">Estados Unidos</option>
        <option value="Canadá">Canadá</option>
        <option value="Outro">Outro..</option>
      </select>
    </div>
    <div className="form-group">
      {errors.state && <p className="field-error">{errors.state}</p>}
      <select
        name="state"
        value={formData.state}
        onChange={handleChange}
        required
        className={errors.state ? 'input-error' : ''}
      >
        <option value="">Estado...</option>
        <option value="São Paulo">São Paulo</option>
        <option value="Rio de Janeiro">Rio de Janeiro</option>
        <option value="Minas Gerais">Minas Gerais</option>
        <option value="Outro">Outro..</option>
      </select>
    </div>
  </div>
  <button type="submit" className='cadastro-btn'>Registrar</button>
</form>
            <div className="already-account">
              Já possui uma conta? <a href="/login">Clique aqui</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;