import { Message, MessageContent } from "./types/message";
import { Server, Socket } from "socket.io";
// import { Request, Response } from 'express';
import { EventEnum } from "./types/events.js";
import express from "express";
import fs from "fs";
import http from "http";
import { v4 as uuidv4 } from "uuid";

const app = express();
const server = http.createServer(app);
export class SDK {
  public io: Server;
  public logFilePath: string;
  constructor(server: http.Server, logFilePath = "./log.txt") {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    this.logFilePath = logFilePath;
    let ref = this;
  }
  public on(event: EventEnum, callback: Function) {
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
  public send(event: EventEnum, data: MessageContent, socket:Socket) {
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
  public disconnect() {
    this.io.close();
  }
}
// let sdk = new SDK(server);

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });
// sdk.on(EventEnum.message, (message: Message) => {
//   console.log(message);
// });
// server.listen(3000, () => {
//   console.log("listening on *:3000");
// });
