let stompClient = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    connect();
    const messageInput = document.getElementById('message');
    messageInput.addEventListener('keypress', function (event) {
        // Verificar si la tecla presionada es 'Enter'
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });
});

// 1. Cargar historial desde MySQL (API REST)
async function loadHistory() {
    try {
        const response = await fetch('/api/messages');
        const messages = await response.json();
        messages.forEach(msg => displayMessage(msg, false));
    } catch (err) {
        showNotification("SISTEMA", "Fallo al recuperar historial de DB", "bg-red-600");
    }
}

// 2. Protocolo de Conexión WebSocket
function connect() {
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.debug = null; // Limpia la consola

    stompClient.connect({}, () => {
        updateStatus(true);
        showNotification("CONECTADO", "Enlace WebSocket establecido", "bg-green-600");

        stompClient.subscribe('/topic/public', (payload) => {
            const msg = JSON.parse(payload.body);
            displayMessage(msg, true);
        });
    }, (error) => {
        updateStatus(false);
        showNotification("ERROR", "Reintentando conexión en 5s...", "bg-red-600");
        setTimeout(connect, 5000);
    });
}

// 3. Envío de Datos al Servidor
function sendMessage() {
    const user = document.getElementById('username').value.trim();
    const content = document.getElementById('message').value.trim();

    if (user && content) {
        const msgObj = { sender: user, content: content };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(msgObj));
        document.getElementById('message').value = '';
    } else {
        showNotification("AVISO", "Parámetros incompletos", "bg-yellow-600");
    }
}

// 4. Renderizado de Mensajes
function displayMessage(msg, notify) {
    const chatBox = document.getElementById('chat-box');
    const currentUser = document.getElementById('username').value;
    const isMe = currentUser === msg.sender;

    const div = document.createElement('div');
    div.className = `flex ${isMe ? 'justify-end' : 'justify-start'} message-in`;

    div.innerHTML = `
        <div class="max-w-[80%] p-3 rounded-2xl shadow-lg ${isMe ? 'bg-blue-600 rounded-tr-none' : 'bg-slate-700 rounded-tl-none'}">
            <p class="text-[10px] font-mono font-bold uppercase tracking-widest ${isMe ? 'text-blue-200' : 'text-blue-400'}">${msg.sender}</p>
            <p class="text-sm mt-1">${msg.content}</p>
            <p class="text-[9px] text-right mt-1 opacity-50 font-mono">${msg.timestamp || ''}</p>
        </div>
    `;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (notify && !isMe) {
        showNotification("MENSAJE RECIBIDO", `${msg.sender} ha enviado datos`, "bg-indigo-600");
    }
}

// 5. Sistema de Notificaciones "Toasts"
function showNotification(title, text, colorClass) {
    const container = document.getElementById('notifications');
    const toast = document.createElement('div');
    toast.className = `${colorClass} p-3 rounded-lg shadow-2xl animate__animated animate__fadeInRight flex flex-col min-w-[220px] border border-white/20`;

    toast.innerHTML = `
        <strong class="text-xs font-black tracking-tighter">${title}</strong>
        <span class="text-[10px] uppercase font-semibold">${text}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.replace('animate__fadeInRight', 'animate__fadeOutRight');
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

function updateStatus(online) {
    const badge = document.getElementById('status-badge');
    badge.innerText = online ? "ONLINE" : "OFFLINE";
    badge.className = `text-xs px-3 py-1 rounded-full border ${online ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-red-900/30 border-red-500 text-red-400'}`;
}