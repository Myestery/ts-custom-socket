import { Message, MessageContent } from "./types/message";
import { Socket, io } from "socket.io-client";

import { EventEnum } from "./types/events";
import { v4 as uuidv4 } from "uuid";

export class ClientSDK {
  public io: Socket;
  public socketMessageUl: HTMLElement;
  constructor(url: string) {
    this.io = io(url);
    // check if there's a ul with an id of socket-messages
    // if not, create one
    let socketMessages = document.getElementById("socket-messages");
    if (!socketMessages) {
      socketMessages = document.createElement("ul");
      socketMessages.id = "socket-messages";
      document.body.appendChild(socketMessages);
    }
    this.socketMessageUl = socketMessages;
  }
  public on(event: EventEnum, callback: any) {
    this.io.on(event, (message: Message) => {
      this.logMessage("RECV", message);
      callback(message);
    });
  }
  public send(data: MessageContent) {
    let message: Message = {
      content: data,
      id: uuidv4(),
      sentAt: new Date(),
    };
    this.io.emit(EventEnum.message, message);
    this.logMessage("SEND", message);
  }

  public logMessage(type: "RECV" | "SEND", message: Message) {
    let content =
      typeof message.content === "string"
        ? message.content
        : JSON.stringify(message.content);
    let logMessage = `
${type}: ${content}`;
    // append to the ul socketMessageUl
    this.socketMessageUl.innerHTML += `<li>${logMessage}</li>`;
  }
  public disconnect() {
    this.io.disconnect();
  }
}
declare global {
  interface Window {
    sdk: any;
  }
}
window.sdk = new ClientSDK("http://localhost:3000");
window.sdk.on("message", (message: Message) => {
  console.log(message);
});
