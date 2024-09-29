package br.com.cauaqroz.ConectaPlus.service;

import br.com.cauaqroz.ConectaPlus.model.Friendship;
import br.com.cauaqroz.ConectaPlus.model.User;
import java.util.Optional;
import java.util.List;
import java.util.Map;

public interface IUserService {
    User createUser(User userDto);
    Optional<User> getUserByEmail(String email);
    Optional<User> getUserById(String id);
    void deleteUserById(String userId);
    String loginUser(User loginDetails);
    void updateUser(String userId, Map<String, Object> updates);
    void uploadAvatar(String userId, String avatarUrl);
    void addFriend(String userId, String friendId);
    void removeFriend(String userId, String friendId);
    List<User> findAll();
    List<User> searchUsersByName(String name);
    List<Friendship> getFriendships(String userId);
}