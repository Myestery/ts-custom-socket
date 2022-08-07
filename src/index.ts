import { Message, MessageContent } from "./types/message";

import { EventEnum } from "./types/events.js";
import { Server } from "socket.io";
import express from "express";
import fs from "fs";
import http from "http";
import { v4 as uuidv4 } from "uuid";

const app = express();
const server = http.createServer(app);
export class SDK {
  public io: Server;
  public server;
  public logFilePath: string;
  constructor(server: any, logFilePath = "./log.txt") {
    this.server = server;
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    this.logFilePath = logFilePath;
    let ref = this;
  }
  public on(event: EventEnum, callback: any) {
    this.io.on("connection", (socket) => {
      socket.on(event, (message: Message) => {
        this.logMessage("RECV", message);
        this.send(
          EventEnum.message,
          {
            content: "Hello, we received your message with id " + message.id,
            id: uuidv4(),
            sentAt: new Date(),
          },
          socket
        );
        callback(message);
      });
    });
  }
  public send(event: EventEnum, data: MessageContent, socket) {
    let message: Message = {
      content: data,
      id: uuidv4(),
      sentAt: new Date(),
    };
    socket.emit(event, message);
    this.logMessage("SEND", message);
  }
  public logMessage(type: "RECV" | "SEND", message: Message) {
    let content =
      typeof message.content === "string"
        ? message.content
        : JSON.stringify(message.content);
    let logMessage = `
${type}: ${content}`;
    // append to file
    fs.appendFile(this.logFilePath, logMessage, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}
let sdk = new SDK(server);

app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});
sdk.on(EventEnum.message, (message: Message) => {
  console.log(message);
});
server.listen(3000, () => {
  console.log("listening on *:3000");
});
