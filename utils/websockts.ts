// import WebSocket from "ws";
// import { Request, Express} from "express";

// export default (expressServer: Express) => {
//     const webSocketServer = new WebSocket.Server({
//         noServer: true,
//         path: "/websockets"
//     });

//     expressServer.on('upgrade', (request: Request, socket: WebSocket, head: any) => {
//         webSocketServer.handleUpgrade(request, socket, head, (websocket: WebSocket) => {
//             webSocketServer.on('connection', websocket, request);
//         })
//     });

//     return webSocketServer;
// }