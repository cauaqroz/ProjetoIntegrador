package br.com.cauaqroz.ConectaPlus.model;

import java.util.ArrayList;
import java.util.List;

public class Channel {
    private String id;
    private String masterUserId;
    private List<String> allowedUserIds;
    private List<String> accessRequests;
    private List<Message> messages;

    public Channel() {
        this.allowedUserIds = new ArrayList<>();
        this.accessRequests = new ArrayList<>();
        this.messages = new ArrayList<>();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public List<Message> getMessages() {
        return messages;
    }
    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
    public String getMasterUserId() {
        return masterUserId;
    }
    public void setMasterUserId(String masterUserId) {
        this.masterUserId = masterUserId;
    }
    public List<String> getAllowedUserIds() {
        return allowedUserIds;
    }
    public void setAllowedUserIds(List<String> allowedUserIds) {
        this.allowedUserIds = allowedUserIds;
    }
    public List<String> getAccessRequests() {
        return accessRequests;
    }
    public void setAccessRequests(List<String> accessRequests) {
        this.accessRequests = accessRequests;
    }
}