package br.com.cauaqroz.ConectaPlus.Controller;

import br.com.cauaqroz.ConectaPlus.model.Message;
import br.com.cauaqroz.ConectaPlus.service.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class NotificationController {

    @Autowired
    private INotificationService notificationService;

    @GetMapping("/notifications")
    public ResponseEntity<List<Message>> getNotifications(@RequestHeader("userId") String userId) {
        List<Message> newMessages = notificationService.getNotifications(userId);
        return ResponseEntity.ok(newMessages);
    }
}