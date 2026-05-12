package pe.faustino.gestor.chat_websocket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import pe.faustino.gestor.chat_websocket.entity.ChatMessage;
import pe.faustino.gestor.chat_websocket.repository.MessageRepository;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "*") // Permite peticiones desde el frontend
public class ChatController {

    @Autowired
    private MessageRepository repository;

    // API REST: Cargar historial con Fetch
    @GetMapping("/api/messages")
    public List<ChatMessage> getHistory() {
        return repository.findAll();
    }

    // WEBSOCKET: Recibe mensajes de /app/chat.sendMessage y los envía a /topic/public
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage chatMessage) {
        chatMessage.setTimestamp(LocalDateTime.now().toString());
        return repository.save(chatMessage); // Guarda en MySQL y retransmite
    }
}