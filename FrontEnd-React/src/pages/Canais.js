import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import config from '../config/Config';
import '../styles/Canais.css';

const Canais = () => {
  const [friends, setFriends] = useState([]);
  const [channels, setChannels] = useState({});
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFriendsAndChannels = async () => {
      const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
      const friendsList = loggedInUser.friends;

      setFriends(friendsList);

      const channelsData = {};
      for (const friendId of friendsList) {
        try {
          const channelResponse = await axios.get(`${config.LocalApi}/channels/between/${loggedInUser.id}/${friendId}`);
          if (channelResponse.status === 200) {
            console.log(`Canal encontrado para o amigo com ID: ${friendId}`, channelResponse.data);
            channelsData[friendId] = channelResponse.data[0]; // Acessando o primeiro elemento do array
          }
        } catch (error) {
          console.error(`Erro ao buscar canal entre ${loggedInUser.id} e ${friendId}:`, error);
        }
      }
      setChannels(channelsData);
      console.log('Canais carregados:', channelsData);
    };

    fetchFriendsAndChannels();
  }, []);

  useEffect(() => {
    let interval;
    if (selectedChannelId) {
      interval = setInterval(() => {
        fetch(`${config.LocalApi}/chat/${selectedChannelId}/messages`)
          .then(response => response.json())
          .then(data => setMessages(data));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedChannelId]);

  const handleFriendClick = (friendId) => {
    const channel = channels[friendId];
    if (channel) {
      setSelectedChannelId(channel.id);
      setMessages(channel.messages || []);
      setIsModalOpen(true);
      console.log(`Canal selecionado: ${channel.id}`);
    } else {
      console.error(`Canal não encontrado para o amigo com ID: ${friendId}`);
    }
  };

  const enviarMensagem = async () => {
    if (newMessage.trim() === '' || !selectedChannelId) return;

    console.log('Enviando mensagem:', newMessage);

    try {
      const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
      const response = await fetch(`${config.LocalApi}/chat/${selectedChannelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newMessage,
          sender: loggedInUser.id
        })
      });

      const responseData = await response.json();
      console.log('Resposta do servidor:', responseData);

      if (response.ok) {
        console.log('Mensagem enviada com sucesso');
        setNewMessage('');
        fetch(`${config.LocalApi}/chat/${selectedChannelId}/messages`)
          .then(response => response.json())
          .then(data => setMessages(data));
      } else {
        console.error('Erro ao enviar mensagem:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChannelId(null);
    setMessages([]);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar activeTab="/channel" />
      <div className="container">
        <Header />
        <div className="channel-content">
          <div className="friends-list">
            {friends.map(friendId => (
              <div key={friendId} className="friend-card" onClick={() => handleFriendClick(friendId)}>
                <img src={`default-avatar.png`} alt={`Friend ${friendId}`} />
                <div className="friend-card-info">
                  <h3>Friend {friendId}</h3>
                  <p>{friendId}@example.com</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="messages">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <div key={index} className={`message ${message.sender === JSON.parse(sessionStorage.getItem('user')).id ? 'sent' : 'received'}`}>
                    <p>{message.content}</p>
                  </div>
                ))
              ) : (
                <p>Nenhuma mensagem ainda.</p>
              )}
            </div>
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
              />
              <button onClick={enviarMensagem}>Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canais;