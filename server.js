// server.js - Relay Radio Boss Web -> Icecast 8688 /stream
const WebSocket = require('ws');
const net = require('net');
const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });
wss.on('connection', (ws) => {
  let icecastSocket = null;
  ws.on('message', (data) => {
    try {
      let txt = data.toString();
      if (txt.startsWith('{')) {
        let config = JSON.parse(txt);
        console.log("Conectando a", config.host, config.port);
        icecastSocket = net.connect(config.port, config.host, () => {
          let header = `SOURCE ${config.mount} HTTP/1.0\r\n` +
            `Authorization: Basic ${Buffer.from(config.user + ":" + config.password).toString('base64')}\r\n` +
            `Content-Type: audio/mpeg\r\n` +
            `Ice-Name: Radio Boss Web\r\n\r\n`;
          icecastSocket.write(header);
          ws.send("✅ CONECTADO A " + config.host + ":" + config.port + config.mount);
        });
        icecastSocket.on('error', (e) => ws.send("❌ Error: " + e.message));
        return;
      }
      if (icecastSocket && data.length > 10) icecastSocket.write(data);
    } catch(e) { console.log(e); }
  });
  ws.on('close', () => { if (icecastSocket) icecastSocket.end(); });
});
console.log("Relay ONLINE - Icecast 8688");
