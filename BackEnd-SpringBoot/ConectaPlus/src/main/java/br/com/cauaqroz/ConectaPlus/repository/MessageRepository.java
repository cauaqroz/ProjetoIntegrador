package br.com.cauaqroz.ConectaPlus.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import br.com.cauaqroz.ConectaPlus.model.Message;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByChannelId(String channelId);
}