const WebSocket = require('ws');
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8081 });

const clients = new Set();

wss.on('connection', (ws) => {
    console.log('Клиент подключился');
    clients.add(ws);

    ws.on('message', (message) => {
        console.log('Получено сообщение:', message.toString());
        const data = JSON.parse(message);
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                console.log('Отправлено клиенту:', data);
                client.send(JSON.stringify(data));
            }
        });
    });

    ws.on('close', () => {
        console.log('Клиент отключился');
        clients.delete(ws);
    });
});

console.log('WebSocket сервер запущен на ws://0.0.0.0:8081');