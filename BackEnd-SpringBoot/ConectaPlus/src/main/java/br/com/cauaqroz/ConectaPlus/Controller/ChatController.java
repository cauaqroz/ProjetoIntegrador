package br.com.cauaqroz.ConectaPlus.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import br.com.cauaqroz.ConectaPlus.model.Message;
import br.com.cauaqroz.ConectaPlus.service.IMessageService;

import java.util.List;

@RestController
public class ChatController {

    @Autowired
    private IMessageService messageService;

    @MessageMapping("/chat/{channelId}")
    @SendTo("/channel/{channelId}")
    public Message send(@DestinationVariable String channelId, Message message) throws Exception {
        return messageService.sendMessage(channelId, message);
    }

    @PostMapping("/chat/{channelId}")
    public Message sendPost(@PathVariable String channelId, @RequestBody Message message) throws Exception {
        return this.send(channelId, message);
    }

    @GetMapping("/chat/{channelId}/messages")
    public List<Message> getMessages(@PathVariable String channelId) throws Exception {
        return messageService.getMessagesByChannelId(channelId);
    }

    @ExceptionHandler(Exception.class)
    public String handleException(Exception e) {
        return e.getMessage();
    }
}