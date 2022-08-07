import { EventEnum } from "./types/events";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
var ClientSDK = /** @class */ (function () {
    function ClientSDK(url) {
        this.io = io(url);
        // check if there's a ul with an id of socket-messages
        // if not, create one
        var socketMessages = document.getElementById("socket-messages");
        if (!socketMessages) {
            socketMessages = document.createElement("ul");
            socketMessages.id = "socket-messages";
            document.body.appendChild(socketMessages);
        }
        this.socketMessageUl = socketMessages;
    }
    ClientSDK.prototype.on = function (event, callback) {
        var _this = this;
        this.io.on(event, function (message) {
            _this.logMessage("RECV", message);
            callback(message);
        });
    };
    ClientSDK.prototype.send = function (data) {
        var message = {
            content: data,
            id: uuidv4(),
            sentAt: new Date(),
        };
        this.io.emit(EventEnum.message, message);
        this.logMessage("SEND", message);
    };
    ClientSDK.prototype.logMessage = function (type, message) {
        var content = typeof message.content === "string"
            ? message.content
            : JSON.stringify(message.content);
        var logMessage = "\n".concat(type, ": ").concat(content);
        // append to the ul socketMessageUl
        this.socketMessageUl.innerHTML += "<li>".concat(logMessage, "</li>");
    };
    return ClientSDK;
}());
export { ClientSDK };
window.sdk = new ClientSDK("http://localhost:3000");
//# sourceMappingURL=browser.js.map