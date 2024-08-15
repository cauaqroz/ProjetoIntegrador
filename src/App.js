// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Projeto from './components/Projeto';
import Inicial from './pages/Inicial'; // Importe a nova página

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projeto/:projetoId" element={<Projeto />} />
        <Route path="/inicial" element={<Inicial />} /> {/* Adicione a nova rota */}
      </Routes>
    </Router>
  );
};

export default App;