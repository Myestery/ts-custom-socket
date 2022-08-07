import { EventEnum } from "./types/events.js";
import { Server } from "socket.io";
import express from "express";
import fs from "fs";
import http from "http";
import { v4 as uuidv4 } from "uuid";
var app = express();
var server = http.createServer(app);
var SDK = /** @class */ (function () {
    function SDK(server, logFilePath) {
        if (logFilePath === void 0) { logFilePath = "./log.txt"; }
        this.server = server;
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        this.logFilePath = logFilePath;
        var ref = this;
    }
    SDK.prototype.on = function (event, callback) {
        var _this = this;
        this.io.on("connection", function (socket) {
            socket.on(event, function (message) {
                _this.logMessage("RECV", message);
                _this.send(EventEnum.message, {
                    content: "Hello, we received your message with id " + message.id,
                    id: uuidv4(),
                    sentAt: new Date(),
                }, socket);
                callback(message);
            });
        });
    };
    SDK.prototype.send = function (event, data, socket) {
        var message = {
            content: data,
            id: uuidv4(),
            sentAt: new Date(),
        };
        socket.emit(event, message);
        this.logMessage("SEND", message);
    };
    SDK.prototype.logMessage = function (type, message) {
        var content = typeof message.content === "string"
            ? message.content
            : JSON.stringify(message.content);
        var logMessage = "\n".concat(type, ": ").concat(content);
        // append to file
        fs.appendFile(this.logFilePath, logMessage, function (err) {
            if (err) {
                console.error(err);
            }
        });
    };
    return SDK;
}());
export { SDK };
var sdk = new SDK(server);
app.get("/", function (req, res) {
    res.send("Hello World!");
});
sdk.on(EventEnum.message, function (message) {
    console.log(message);
});
server.listen(3000, function () {
    console.log("listening on *:3000");
});
//# sourceMappingURL=index.js.map