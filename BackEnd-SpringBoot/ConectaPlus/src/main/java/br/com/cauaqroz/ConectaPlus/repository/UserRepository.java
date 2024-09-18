package br.com.cauaqroz.ConectaPlus.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import br.com.cauaqroz.ConectaPlus.model.User;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByAvatar(String avatarId);
}