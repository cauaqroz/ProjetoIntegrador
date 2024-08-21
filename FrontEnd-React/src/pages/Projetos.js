import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Ajuste o caminho conforme necessário
import Header from '../components/Header';   // Ajuste o caminho conforme necessário
import '../styles/Projetos.css'; // Importe o CSS exclusivo para a página de projetos
import { useState, useEffect, useRef } from 'react';

const Projetos = () => {
  const [user, setUser] = useState(null);
  const [projetosCriados, setProjetosCriados] = useState([]);
  const [projetosParticipando, setProjetosParticipando] = useState([]);
  const [selectedProjeto, setSelectedProjeto] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState(''); // Novo estado para a nova mensagem
  const [activeTab, setActiveTab] = useState('informacoes');
  const [shouldScroll, setShouldScroll] = useState(true); // Estado para controlar a rolagem automática
  const [participantesAprovados, setParticipantesAprovados] = useState([]); // Novo estado para participantes aprovados
  const navigate = useNavigate();
  const mensagensEndRef = useRef(null); // Referência para o final da lista de mensagens

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setProjetosCriados(userData.projetosCriados || []);
      setProjetosParticipando(userData.projetosParticipando || []);
    }
  }, []);

  useEffect(() => {
    if (selectedProjeto) {
      fetch(`http://localhost:2216/projetos/${selectedProjeto.id}/pedidosParticipacao`)
        .then(response => response.json())
        .then(ids => {
          Promise.all(ids.map(id => fetch(`http://localhost:2216/users/${id}`).then(res => res.json())))
            .then(users => setSolicitacoes(users));
        });

      if (selectedProjeto.chatId) {
        fetch(`http://localhost:2216/chat/${selectedProjeto.chatId}/messages`)
          .then(response => response.json())
          .then(data => setMensagens(data));
      }

      if (selectedProjeto.approvedParticipants && selectedProjeto.approvedParticipants.length > 0) {
        Promise.all(selectedProjeto.approvedParticipants.map(id => fetch(`http://localhost:2216/users/${id}`).then(res => res.json())))
          .then(users => setParticipantesAprovados(users));
      } else {
        setParticipantesAprovados([]);
      }
    }
  }, [selectedProjeto]);

  useEffect(() => {
    let interval;
    if (activeTab === 'canal' && selectedProjeto) {
      interval = setInterval(() => {
        fetch(`http://localhost:2216/chat/${selectedProjeto.chatId}/messages`)
          .then(response => response.json())
          .then(data => setMensagens(data));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTab, selectedProjeto]);

  useEffect(() => {
    if (activeTab === 'canal' && shouldScroll && mensagensEndRef.current) {
      mensagensEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setShouldScroll(false); // Desativar a rolagem automática após a primeira rolagem
    }
  }, [activeTab, mensagens, shouldScroll]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const handleProjetoClick = (projeto) => {
    setSelectedProjeto(projeto);
    setShouldScroll(true); // Ativar a rolagem automática ao selecionar um novo projeto
  };

  const handleBackToMenu = () => {
    setSelectedProjeto(null);
  };

  const handleAprovar = (userId) => {
    if (selectedProjeto && user) {
      fetch(`http://localhost:2216/projetos/${selectedProjeto.id}/aprovarUsuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ownerId': user.id
        },
        body: JSON.stringify({ userId })
      })
      .then(response => {
        if (response.ok) {
          setSolicitacoes(solicitacoes.filter(user => user.id !== userId));
        } else {
          console.error('Erro ao aprovar solicitação');
        }
      })
      .catch(error => console.error('Erro ao aprovar solicitação:', error));
    }
  };

  const handleNegar = (userId) => {
    if (selectedProjeto && user) {
      fetch(`http://localhost:2216/projetos/${selectedProjeto.id}/negarSolicitacao/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'ownerId': user.id
        }
      })
      .then(response => {
        if (response.ok) {
          setSolicitacoes(solicitacoes.filter(user => user.id !== userId));
        } else {
          console.error('Erro ao negar solicitação');
        }
      })
      .catch(error => console.error('Erro ao negar solicitação:', error));
    }
  };

  const enviarMensagem = async () => {
    if (novaMensagem.trim() === '') return;
  
    console.log('Enviando mensagem:', novaMensagem);
  
    try {
      const response = await fetch(`http://localhost:2216/chat/${selectedProjeto.chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: novaMensagem,
          sender: user.id
        })
      });
  
      const responseData = await response.json();
      console.log('Resposta do servidor:', responseData);
  
      if (response.ok) {
        console.log('Mensagem enviada com sucesso');
        setNovaMensagem(''); // Limpar o campo de entrada
        fetch(`http://localhost:2216/chat/${selectedProjeto.chatId}/messages`)
          .then(response => response.json())
          .then(data => setMensagens(data)); // Atualizar as mensagens
      } else {
        console.error('Erro ao enviar mensagem:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'informacoes':
        return (
          <>
            <h2>{selectedProjeto.titulo}</h2>
            <p>{selectedProjeto.descricao}</p>
            <p><strong>Tecnologia:</strong> {selectedProjeto.tecnologia}</p>
            {/* Adicione mais detalhes do projeto conforme necessário */}
            <div className="arquivos">
              <h3>Arquivos</h3>
              {/* Conteúdo dos arquivos */}
            </div>
          </>
        );
      case 'solicitacoes':
        return (
          <div className="solicitacoes-card">
            <h3>Lista de Solicitações</h3>
            {solicitacoes.length > 0 ? (
              solicitacoes.map(user => (
                <div key={user.id} className="solicitacao-item">
                  <p>{user.name} {user.lastName}</p>
                  <button onClick={() => handleAprovar(user.id)}>Aprovar</button>
                  <button onClick={() => handleNegar(user.id)}>Negar</button>
                </div>
              ))
            ) : (
              <p>Nenhuma solicitação encontrada.</p>
            )}
          </div>
        );
      case 'participantes':
        return (
          <div className="participantes-card">
            <h3>Lista de Participantes</h3>
            {participantesAprovados.length > 0 ? (
              participantesAprovados.map(user => (
                <div key={user.id} className="participante-item">
                  <p>{user.name} {user.lastName}</p>
                </div>
              ))
            ) : (
              <p>Nenhum participante encontrado.</p>
            )}
          </div>
        );
      case 'canal':
        return (
          <div className="canal-card">
            <h3>Canal de Comunicação</h3>
            <div className="mensagens">
              {mensagens.map(mensagem => (
                <div key={mensagem.createdDate} className={`mensagem ${mensagem.sender === user.id ? 'mensagem-direita' : 'mensagem-esquerda'}`}>
                  {mensagem.sender !== user.id && <p><strong>{mensagem.senderName}</strong></p>}
                  <p>{mensagem.content}</p>
                  <span>{new Date(mensagem.createdDate).toLocaleString()}</span>
                </div>
              ))}
              <div ref={mensagensEndRef} />
            </div>
            <div className="nova-mensagem">
              <input
                type="text"
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder="Digite sua mensagem"
              />
              <button onClick={enviarMensagem}>Enviar</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="projects-page">
      <Sidebar activeTab="/projetos" />
      <div className="container-projects">
        <Header onLogout={handleLogout} />
        <div className="projects-content">
          <div className="projects-feed">
            {selectedProjeto ? (
              <div className="projects-detalhes full-screen">
                <span className="material-symbols-outlined close-icon" onClick={handleBackToMenu} style={{ cursor: 'pointer' }}>
                  close
                </span>
                <div className="tabs">
                  <button onClick={() => setActiveTab('informacoes')} className={activeTab === 'informacoes' ? 'active' : ''}>Informações</button>
                  <button onClick={() => setActiveTab('solicitacoes')} className={activeTab === 'solicitacoes' ? 'active' : ''}>Solicitações</button>
                  <button onClick={() => setActiveTab('participantes')} className={activeTab === 'participantes' ? 'active' : ''}>Participantes</button>
                  <button onClick={() => { setActiveTab('canal'); setShouldScroll(true); }} className={activeTab === 'canal' ? 'active' : ''}>Canal</button>
                </div>
                <div className="tab-content">
                  {renderTabContent()}
                </div>
              </div>
            ) : (
              <>
                <h2>Projetos Criados</h2>
                <div className="projects-grid">
                  {projetosCriados.length > 0 ? (
                    projetosCriados.map(projeto => (
                      <div key={projeto.id} className="projects-item" onClick={() => handleProjetoClick(projeto)}>
                        <h2>{projeto.titulo}</h2>
                        <p>{projeto.descricao}</p>
                        <p><strong>Tecnologia:</strong> {projeto.tecnologia}</p>
                      </div>
                    ))
                  ) : (
                    <p>Nenhum projeto encontrado.</p>
                  )}
                </div>
                <br></br>
                <h2>Projetos Participando</h2>
                <div className="projects-grid">
                  {projetosParticipando.length > 0 ? (
                    projetosParticipando.map(projeto => (
                      <div key={projeto.id} className="projects-item" onClick={() => handleProjetoClick(projeto)}>
                        <h2>{projeto.titulo}</h2>
                        <p>{projeto.descricao}</p>
                        <p><strong>Tecnologia:</strong> {projeto.tecnologia}</p>
                      </div>
                    ))
                  ) : (
                    <p>Nenhum projeto encontrado.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projetos;