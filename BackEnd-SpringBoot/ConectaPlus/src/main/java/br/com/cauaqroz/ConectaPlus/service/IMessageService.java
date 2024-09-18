package br.com.cauaqroz.ConectaPlus.service;

import br.com.cauaqroz.ConectaPlus.model.Message;
import java.util.List;

public interface IMessageService {
    Message sendMessage(String channelId, Message message) throws Exception;
    List<Message> getMessagesByChannelId(String channelId) throws Exception;
}