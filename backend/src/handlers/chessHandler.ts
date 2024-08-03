import {Connection, Packet} from "./../server"
import { threeMinQeue, fiveMinQeue, tenMinQeue } from "../states/chess/gameState"
import { WebSocket } from "ws"
import indexByWs from "../utils/indexByWs"

export default function chessHandler(packet: Packet, ws: WebSocket, usersConnected: Connection[]) {
  const i = indexByWs(ws, usersConnected)

  if (i === -1) {
    throw new Error("connection not found")
  }

  if (packet.action === "matchmake3min") {
    threeMinQeue.push(usersConnected[i])
  } else if (packet.action === "matchmake5min") {
    fiveMinQeue.push(usersConnected[i])
  } else if (packet.action === "matchmake10min") {
    tenMinQeue.push(usersConnected[i])
  }

  const returnPacket: Packet = {
    id: packet.id,
    action: packet.action,
    payload: {status: true, msg:"done!"}
  }

  ws.send(JSON.stringify(returnPacket))
}
