package br.com.cauaqroz.ConectaPlus.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import br.com.cauaqroz.ConectaPlus.model.Channel;

public interface ChannelRepository extends MongoRepository<Channel, String> {
}