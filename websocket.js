
const { WebSocketServer } = require('ws');
let wss = null;

const initializeWebSocketServer = (server) => {
    wss = new WebSocketServer({ server });
    console.log("WebSocket server initialized.");
};

const getWebSocketServer = () => {
    if (!wss) {
        throw new Error("WebSocket server not initialized yet.");
    }
    return wss;
};

module.exports = { initializeWebSocketServer, getWebSocketServer };
