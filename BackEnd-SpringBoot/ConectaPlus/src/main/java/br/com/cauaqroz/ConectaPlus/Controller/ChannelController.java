package br.com.cauaqroz.ConectaPlus.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.cauaqroz.ConectaPlus.model.Channel;
import br.com.cauaqroz.ConectaPlus.service.IChannelService;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ChannelController {

    @Autowired
    private IChannelService channelService;

    @PostMapping("/channel")
    public ResponseEntity<Channel> createChannel(@RequestBody Channel channel, @RequestHeader("userId") String userId) {
        Channel createdChannel = channelService.createChannel(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdChannel);
    }

    @PostMapping("/channel/{channelId}/authorize")
    public ResponseEntity<?> authorizeUser(@PathVariable String channelId, @RequestBody List<String> userIds,
                                           @RequestHeader("userId") String masterUserId) {
        Channel channel = channelService.findById(channelId).orElse(null);
        if (channel == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Canal não encontrado.");
        }
        if (!channel.getMasterUserId().equals(masterUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Apenas o mestre do canal pode autorizar usuários.");
        }
        List<String> allowedUserIds = channel.getAllowedUserIds();
        if (allowedUserIds == null) {
            allowedUserIds = new ArrayList<>();
        }
        List<String> accessRequests = channel.getAccessRequests();
        boolean updated = false;
        for (String userId : userIds) {
            if (accessRequests.contains(userId) && !allowedUserIds.contains(userId)) {
                allowedUserIds.add(userId);
                accessRequests.remove(userId);
                updated = true;
            }
        }
        if (updated) {
            channel.setAllowedUserIds(allowedUserIds);
            channel.setAccessRequests(accessRequests);
            channelService.save(channel);
            return ResponseEntity.ok("Usuário(s) autorizado(s) com sucesso.");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nenhuma atualização necessária ou usuário(s) já autorizado(s).");
    }

    @PostMapping("/channel/{channelId}/deny-access")
    public ResponseEntity<?> denyAccess(@PathVariable String channelId, @RequestBody List<String> userIds,
                                        @RequestHeader("userId") String masterUserId) {
        Channel channel = channelService.findById(channelId).orElse(null);
        if (channel == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Canal não encontrado.");
        }
        if (!channel.getMasterUserId().equals(masterUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Apenas o mestre do canal pode negar acesso.");
        }

        List<String> accessRequests = channel.getAccessRequests();
        if (accessRequests != null) {
            accessRequests.removeAll(userIds);
        }

        List<String> allowedUserIds = channel.getAllowedUserIds();
        if (allowedUserIds != null) {
            allowedUserIds.removeAll(userIds);
        }

        channelService.save(channel);
        return ResponseEntity.ok("Acesso removido para os usuários especificados.");
    }

    @PostMapping("/channel/{channelId}/request-access")
    public String requestAccess(@PathVariable String channelId, @RequestHeader("userId") String userId) {
        Channel channel = channelService.findById(channelId).orElse(null);
        if (channel != null) {
            List<String> accessRequests = channel.getAccessRequests();
            if (!accessRequests.contains(userId)) {
                accessRequests.add(userId);
                channel.setAccessRequests(accessRequests);
                channelService.save(channel);
                return "Pedido de acesso enviado.";
            }
            return "Pedido de acesso já enviado.";
        }
        return "Canal não encontrado.";
    }

    @GetMapping("/channel/{channelId}")
    public ResponseEntity<?> joinChannel(@PathVariable String channelId, @RequestHeader("userId") String userId) {
        Channel channel = channelService.findById(channelId).orElse(null);
        if (channel == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Canal não encontrado.");
        }
        if (channel.getAllowedUserIds().contains(userId)) {
            return ResponseEntity.ok(channel);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuário não autorizado a acessar este canal.");
    }

    @GetMapping("/channel/{channelId}/access-requests")
    public ResponseEntity<?> listAccessRequests(@PathVariable String channelId,
                                                @RequestHeader("userId") String userId) {
        Channel channel = channelService.findById(channelId).orElse(null);
        if (channel == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Canal não encontrado.");
        }
        if (!channel.getMasterUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Apenas o mestre do canal pode ver os pedidos de acesso.");
        }
        return ResponseEntity.ok(channel.getAccessRequests());
    }

    @GetMapping("/channels")
    public ResponseEntity<List<Channel>> getAllChannels() {
        return ResponseEntity.ok(channelService.findAll());
    }

    @GetMapping("/channels/{userId}")
    public ResponseEntity<List<Channel>> getChannelsByUserId(@PathVariable String userId) {
        List<Channel> channels = channelService.getChannelsByUserId(userId);
        return ResponseEntity.ok(channels);
    }

}