package br.com.cauaqroz.ConectaPlus.service;

import br.com.cauaqroz.ConectaPlus.model.Message;
import java.util.List;

public interface INotificationService {
    List<Message> getNotifications(String userId);
}