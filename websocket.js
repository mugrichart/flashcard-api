
import { Server } from "socket.io"

class WebSocketServer {
    constructor() {
        if (!WebSocketServer.instance) {
            this.io = null;
            WebSocketServer.instance = this;
        }
        return WebSocketServer.instance;
    }

    initialize(server) {
        if (this.io) {
            console.warn("WebSocket server is already initialized.");
            return;
        }

        this.io = new Server(server, {
            cors: {
                origin: "*", // Adjust for security
                methods: ["GET", "POST"]
            }
        });

        if (this.io) {
            console.log("👌 IO is on!")
        }
    }

    getIO() {
        if (!this.io) {
            throw new Error("[WS] WebSocket server is not initialized.");
        }
        return this.io;
    }

}

export default (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Adjust for security
            methods: ["GET", "POST"]
        }
    });
    
    // Log when the server is created
    console.log("Socket.IO server initialized");
    
    return io;
}

// // Export a single instance
// const webSocketServer = new WebSocketServer();

// export default webSocketServer
