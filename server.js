const WebSocket = require('ws');
const http = require('http');
const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Radio Boss Relay OK - Puente Activo');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Cliente conectado al puente');
  ws.on('message', (data) => {
    // Reenvia audio a todos los clientes conectados
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
  ws.on('close', () => console.log('Cliente desconectado'));
});

server.listen(PORT, () => {
  console.log('Puente corriendo en puerto ' + PORT);
});
