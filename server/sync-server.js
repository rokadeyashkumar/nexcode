// Minimal Yjs WebSocket relay server.
// This is the "sync server" from the architecture diagram: it does not
// understand code, files, or roles - it just relays CRDT updates between
// everyone connected to the same "room" (a room = one file, for now).
//
// Run with: npm run sync-server
// It listens on ws://localhost:1234

const http = require('http');
const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');

const port = process.env.PORT || 1234;

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Yjs sync server is running\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req);
});

server.listen(port, () => {
  console.log(`Yjs sync server listening on ws://localhost:${port}`);
});