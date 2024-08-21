// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Projeto from './components/Projeto';
import Inicial from './pages/Inicial';
import Perfil from './pages/Perfil';
import DetalhesProjeto from './pages/DetalhesProjeto';
import Projetos from './pages/Projetos';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projeto/:projetoId" element={<Projeto />} />
        <Route path="/inicial" element={<Inicial />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/detalhes-projeto/:id" element={<DetalhesProjeto />} />
        
        <Route path="/projetos" element={<Projetos />} />
      </Routes>
    </Router>
  );
};

export default App;