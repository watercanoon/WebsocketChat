package pe.faustino.gestor.chat_websocket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.faustino.gestor.chat_websocket.entity.ChatMessage;

public interface MessageRepository extends JpaRepository<ChatMessage, Long> {
    // Hereda todos los métodos CRUD básicos
}