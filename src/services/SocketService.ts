import { IncomingMessage, Server, ServerResponse } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { performActions } from "../socketActions";
import { v4 as uuidv4 } from "uuid";

export interface CustomWebSocket extends WebSocket {
  id: string;
}

class SocketService {
  private static _instance: SocketService;
  private wss: WebSocketServer;

  constructor(
    httpServer: Server<typeof IncomingMessage, typeof ServerResponse>
  ) {
    this.wss = new WebSocketServer({ server: httpServer });
    this.createSocketServer();
  }

  public static getInstance(
    server: Server<typeof IncomingMessage, typeof ServerResponse>
  ): SocketService {
    if (!this._instance) {
      this._instance = new SocketService(server);
    }
    return this._instance;
  }

  private createSocketServer() {
    this.wss.on("connection", (ws: CustomWebSocket) => {
      ws.on("error", (err) => console.error("error is: ", err));

      //assigning id to socket
      ws.id = uuidv4();

      console.log("Client connected");
      
      this.handleConnection(ws);
    });
  }

  private handleConnection(ws: CustomWebSocket) {
    ws.on("message", (data, isBinary) => {
      let message: {
        type: string;
        data: any;
      } | null = null;

      try {
        message = JSON.parse(data.toString());
      } catch (error) {
        console.error("Error parsing message:", error);
      }

      if (message) {
        performActions(message, ws);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      
    });
  }
}

export default SocketService;
