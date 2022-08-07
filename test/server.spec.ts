import { Server, Socket } from "socket.io";
import { SDK } from "../src/index";
import { EventEnum } from "../js/types/events";
import http, { createServer } from "http";
import { io } from "socket.io-client";
import { ClientSDK } from "../src/browser";

// verify that the SDK can register events
describe("SDK", () => {
  beforeAll((done) => {
    let serverSocket;
    const httpServer = createServer();
    let io = new SDK(httpServer);
    httpServer.listen(3000, () => {
      const port = 3000;
      let clientSocket = new ClientSDK(`http://localhost:${port}`);
      io.on(EventEnum.message, (socket) => {
        serverSocket = socket;
      });
      clientSocket.on(EventEnum.message, done);
    });
  });

  //   afterAll(() => {
  //     io.close();
  //     clientSocket.close();
  //   });

  //   test("should work", (done) => {
  //     clientSocket.on("hello", (arg) => {
  //       expect(arg).toBe("world");
  //       done();
  //     });
  //     serverSocket.emit("hello", "world");
  //   });

  //   test("should work (with ack)", (done) => {
  //     serverSocket.on("hi", (cb) => {
  //       cb("hola");
  //     });
  //     clientSocket.emit("hi", (arg) => {
  //       expect(arg).toBe("hola");
  //       done();
  //     });
  //   });
});
