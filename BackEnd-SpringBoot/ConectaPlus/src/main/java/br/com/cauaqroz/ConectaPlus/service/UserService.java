package br.com.cauaqroz.ConectaPlus.service;

import br.com.cauaqroz.ConectaPlus.model.Channel;
import br.com.cauaqroz.ConectaPlus.model.Friendship;
import br.com.cauaqroz.ConectaPlus.model.User;
import br.com.cauaqroz.ConectaPlus.repository.FriendshipRepository;
import br.com.cauaqroz.ConectaPlus.repository.UserRepository;
import br.com.cauaqroz.ConectaPlus.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
private ChannelService channelService;

    @Override
    public User createUser(User userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        User user = new User();
        user.setName(userDto.getName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(userDto.getPassword());
        user.setPassword(hashedPassword);
        user.setCountry(userDto.getCountry());
        user.setState(userDto.getState());
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    @Override
    public void deleteUserById(String userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public String loginUser(User loginDetails) {
        Optional<User> userOpt = userRepository.findByEmail(loginDetails.getEmail());
        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("Usuário não encontrado.");
        }
        User user = userOpt.get();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(loginDetails.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Senha inválida.");
        }
        return jwtUtil.generateToken(user.getEmail());
    }

    @Override
    public void updateUser(String userId, Map<String, Object> updates) {
        userRepository.findById(userId).ifPresent(user -> {
            updates.forEach((key, value) -> {
                switch (key) {
                    case "name":
                        user.setName((String) value);
                        break;
                    case "lastName":
                        user.setLastName((String) value);
                        break;
                    case "email":
                        String newEmail = (String) value;
                        if (userRepository.findByEmail(newEmail).isPresent() && !user.getEmail().equals(newEmail)) {
                            throw new IllegalArgumentException("Email já está em uso por outro usuário.");
                        }
                        user.setEmail(newEmail);
                        break;
                    case "password":
                        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                        String hashedPassword = passwordEncoder.encode((String) value);
                        user.setPassword(hashedPassword);
                        break;
                    case "country":
                        user.setCountry((String) value);
                        break;
                    case "state":
                        user.setState((String) value);
                        break;
                    default:
                        break;
                }
            });
            userRepository.save(user);
        });
    }

    @Override
    public void uploadAvatar(String userId, String avatarUrl) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setAvatar(avatarUrl);
            userRepository.save(user);
        });
    }


    @Override
    public void addFriend(String userId, String friendId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        User friend = userRepository.findById(friendId).orElseThrow(() -> new RuntimeException("Amigo não encontrado."));
    
        if (user.getFriends() == null) {
            user.setFriends(new ArrayList<>());
        }
        if (friend.getFriends() == null) {
            friend.setFriends(new ArrayList<>());
        }
    
        user.getFriends().add(friendId);
        friend.getFriends().add(userId);
    
        userRepository.save(user);
        userRepository.save(friend);
    
        // Verificar se já existe um canal entre os dois usuários
        List<Channel> existingChannels = channelService.getChannelsBetweenUsers(userId, friendId);
        boolean friendChannelExists = existingChannels.stream().anyMatch(channel -> "friend".equals(channel.getType()));
    
        if (!friendChannelExists) {
            Channel newChannel = new Channel();
            newChannel.setMasterUserId(userId);
            newChannel.setAllowedUserIds(Arrays.asList(userId, friendId));
            newChannel.setType("friend"); // Definir o tipo como "friend"
            channelService.save(newChannel);
        }
    }


    @Override
    public void removeFriend(String userId, String friendId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        User friend = userRepository.findById(friendId).orElseThrow(() -> new RuntimeException("Amigo não encontrado."));

        if (user.getFriends() != null) {
            user.getFriends().remove(friendId);
        }
        if (friend.getFriends() != null) {
            friend.getFriends().remove(userId);
        }

        userRepository.save(user);
        userRepository.save(friend);
    }

@Override
public List<User> findAll() {
    return userRepository.findAll();
}

@Override
public List<User> searchUsersByName(String name) {
    return userRepository.findByNameContainingIgnoreCase(name);
}
@Autowired
private FriendshipRepository friendshipRepository;

public List<Friendship> getFriendships(String userId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    List<String> friendIds = user.getFriends();
    List<Friendship> friendships = new ArrayList<>();
    for (String friendId : friendIds) {
        // Supondo que você tenha um repositório de amizades
        Friendship friendship = friendshipRepository.findByUserIdAndFriendId(userId, friendId);
        if (friendship != null) {
            friendships.add(friendship);
        }
    }
    return friendships;
}
}