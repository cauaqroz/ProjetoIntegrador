package br.com.cauaqroz.ConectaPlus.service;

import br.com.cauaqroz.ConectaPlus.model.Channel;

import java.util.List;
import java.util.Optional;

public interface IChannelService {
    Channel createChannel(String masterUserId);
    void addUserToChannel(String channelId, String userId);
    boolean isUserAllowedInChannel(String channelId, String userId);
    List<Channel> findAll();
    Optional<Channel> findById(String channelId);
    void save(Channel channel);

    void removeUserFromChannel(String channelId, String userId);

    List<Channel> getChannelsByUserId(String userId);

    List<Channel> getChannelsByUserIds(List<String> userIds);

    List<Channel> getChannelsBetweenUsers(String userId1, String userId2);
    

}