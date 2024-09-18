package br.com.cauaqroz.ConectaPlus.service;

import br.com.cauaqroz.ConectaPlus.model.Channel;
import br.com.cauaqroz.ConectaPlus.repository.ChannelRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ChannelService implements IChannelService {
    private final ChannelRepository channelRepository;

    public ChannelService(ChannelRepository channelRepository) {
        this.channelRepository = channelRepository;
    }

    @Override
    public Channel createChannel(String masterUserId) {
        Channel newChannel = new Channel();
        newChannel.setMasterUserId(masterUserId);
        newChannel.setAllowedUserIds(new ArrayList<>(Collections.singletonList(masterUserId)));
        channelRepository.save(newChannel);
        return newChannel;
    }

    @Override
    public void addUserToChannel(String channelId, String userId) {
        Channel channel = channelRepository.findById(channelId).orElse(null);
        if (channel != null) {
            List<String> allowedUserIds = channel.getAllowedUserIds();
            if (!allowedUserIds.contains(userId)) {
                allowedUserIds.add(userId);
                channel.setAllowedUserIds(allowedUserIds);
                channelRepository.save(channel);
            }
        }
    }

    @Override
    public boolean isUserAllowedInChannel(String channelId, String userId) {
        Channel channel = channelRepository.findById(channelId).orElse(null);
        if (channel != null) {
            return channel.getAllowedUserIds().contains(userId);
        }
        return false;
    }

    @Override
    public List<Channel> findAll() {
        return channelRepository.findAll();
    }

    @Override
    public Optional<Channel> findById(String channelId) {
        return channelRepository.findById(channelId);
    }

    @Override
    public void save(Channel channel) {
        channelRepository.save(channel);
    }


    @Override
public void removeUserFromChannel(String channelId, String userId) {
    Channel channel = channelRepository.findById(channelId).orElse(null);
    if (channel != null) {
        List<String> allowedUserIds = channel.getAllowedUserIds();
        if (allowedUserIds.contains(userId)) {
            allowedUserIds.remove(userId);
            channel.setAllowedUserIds(allowedUserIds);
            channelRepository.save(channel);
        }
    }
}

@Override
public List<Channel> getChannelsByUserId(String userId) {
    List<Channel> allChannels = channelRepository.findAll();
    List<Channel> userChannels = new ArrayList<>();
    for (Channel channel : allChannels) {
        if (channel.getAllowedUserIds().contains(userId)) {
            userChannels.add(channel);
        }
    }
    return userChannels;
}
}