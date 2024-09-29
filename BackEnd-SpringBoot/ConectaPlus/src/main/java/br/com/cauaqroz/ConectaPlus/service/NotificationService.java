package br.com.cauaqroz.ConectaPlus.service;

import br.com.cauaqroz.ConectaPlus.model.Channel;
import br.com.cauaqroz.ConectaPlus.model.Message;
import br.com.cauaqroz.ConectaPlus.repository.ChannelRepository;
import br.com.cauaqroz.ConectaPlus.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService implements INotificationService {

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Override
    public List<Message> getNotifications(String userId) {
        // Buscar todos os canais que o usuário participa ou criou
        List<Channel> channels = channelRepository.findAll().stream()
                .filter(channel -> (channel.getMasterUserId() != null && channel.getMasterUserId().equals(userId)) || 
                        (channel.getAllowedUserIds() != null && channel.getAllowedUserIds().contains(userId)))
                .collect(Collectors.toList());

        // Buscar novas mensagens nesses canais
        List<Message> newMessages = new ArrayList<>();
        for (Channel channel : channels) {
            List<Message> messages = messageRepository.findByChannelId(channel.getId());
            // Filtrar mensagens onde o senderId é diferente do userId
            messages.stream()
                    .filter(message -> !message.getSender().equals(userId))
                    .forEach(newMessages::add);
        }

        return newMessages;
    }
}