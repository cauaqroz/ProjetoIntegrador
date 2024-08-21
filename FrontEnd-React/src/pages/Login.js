import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
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
        sessionStorage.setItem('user', JSON.stringify(data)); // Armazena as informações do usuário no sessionStorage

        // Buscar perfil de freelancer
        const freelancerResponse = await fetch(`http://localhost:2216/users/${data.id}/freelancer`);
        if (freelancerResponse.ok) {
          const freelancerData = await freelancerResponse.json();
          sessionStorage.setItem('freelancer', JSON.stringify(freelancerData)); // Armazena as informações do freelancer no sessionStorage
        } else {
          sessionStorage.removeItem('freelancer'); // Remove qualquer perfil de freelancer existente
        }

        navigate('/inicial', { state: { userId: data.id } }); // Passa o ID do usuário como estado na navegação
      } else {
        console.error('Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Senha:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;