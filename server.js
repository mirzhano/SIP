const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
    // Статическая маршрутизация для index.html
    if (req.url === '/' || req.url === '/index.html') {
        res.setHeader('Content-Type', 'text/html');
        res.end(require('fs').readFileSync('index.html'));
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

const wss = new WebSocket.Server({ server });

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

const PORT = process.env.PORT || 8081;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});