package br.com.cauaqroz.ConectaPlus.model;

import java.util.ArrayList;
import java.util.List;

public class Channel {
    private String id;
    private List<String> masterUserIds;
    private List<String> allowedUserIds;
    private List<String> accessRequests;
    private List<Message> messages;
    private String type;

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

    public List<String> getMasterUserId() {
        return masterUserIds;
    }

    public void setMasterUserId(String masterUserId) {
        this.masterUserIds = new ArrayList<>();
        this.masterUserIds.add(masterUserId);
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
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}