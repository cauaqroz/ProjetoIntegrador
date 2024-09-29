package br.com.cauaqroz.ConectaPlus.repository;

import br.com.cauaqroz.ConectaPlus.model.Friendship;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FriendshipRepository extends MongoRepository<Friendship, String> {
    Friendship findByUserIdAndFriendId(String userId, String friendId);
}