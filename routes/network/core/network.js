import ioSetup from "../../../websocket.js";

class Network {
    constructor() {
        this.io = null; // WebSocket connection starts only when needed
        this.routes = {}; // Store routers
    }

    start(server) {
        if (!this.io) {
            this.io = ioSetup(server);
            this.io.on("connection", (socket) => {
                // //console.log("🔧 Connection attempt...");
                socket.on("message", async (message) => {
                    const { method, payload } = message;
                    const [path, ...subPaths] = method.split("/");
                    const subPath = subPaths.join("/");
                    console.log(method.toUpperCase())
                    if (this.routes[path]) {
                        socket.requestPath = method
                        this.routes[path].handle({io: this.io, socket, path: subPath, payload});
                    }
                });
            });
        }
    }

    use(targetPath, targetRouter) {
        this.routes[targetPath] = targetRouter;
    }
}

class Router {
    constructor() {
        this.routes = {};
    }

    route(path, callback) {
        this.routes[path] = callback;
    }

    handle({path, ...resources}) {
        if (this.routes[path]) {
            this.routes[path](resources);
        } else {
            console.warn(`No handler for path: ${path}`);
        }
    }
}

export default new Network();
export { Router };
