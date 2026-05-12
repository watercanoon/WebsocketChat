package pe.faustino.gestor.chat_websocket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import pe.faustino.gestor.chat_websocket.entity.ChatMessage;
import pe.faustino.gestor.chat_websocket.repository.MessageRepository;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private MessageRepository repository;

    @GetMapping("/api/messages")
    public List<ChatMessage> getHistory() {
        return repository.findAll();
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage chatMessage) {
        // 1. Obtener la hora exacta de Perú
        ZonedDateTime nowInPeru = ZonedDateTime.now(ZoneId.of("America/Lima"));

        // 2. Definir un formato limpio y profesional (Ejemplo: 12/05/2026 15:35:28)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

        // 3. Aplicar el formato al mensaje
        chatMessage.setTimestamp(nowInPeru.format(formatter));

        return repository.save(chatMessage);
    }
}