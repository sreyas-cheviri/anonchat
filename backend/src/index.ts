import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port:8080});

interface User {
  socket: WebSocket;
  room: string;
  username: string;
}
const AllSockets: User[] = [];

wss.on("connection", (Clientsocket) => {
  Clientsocket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.type == "join") {
      AllSockets.push({
        socket: Clientsocket,
        room: parsedMessage.payload.roomId,
        username: parsedMessage.payload.username,
      });

    }
    if (parsedMessage.type == "chat") {
      const CurrentUser = AllSockets.find((x) => x.socket === Clientsocket);
      console.log(Clientsocket);
      
      
      const userRoom = CurrentUser?.room;
      console.log(`[${parsedMessage.payload.username}]: ${parsedMessage.payload.message}`);
      AllSockets.forEach((x) => {
        if (userRoom == x.room && x.socket !== Clientsocket) {
          x.socket.send(
            JSON.stringify({
              type: "chat",
              payload: {
                message: parsedMessage.payload.message,
                username: CurrentUser?.username,
              },
            })
          );
        }
      });
    }
  });
});
