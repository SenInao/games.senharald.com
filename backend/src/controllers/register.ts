import { WebSocket } from "ws"
import {Connection, Packet} from "./../server"

export default function register(packet: Packet, ws: WebSocket) {
  const connection: Connection = {
    id: packet.payload.id,
    ws: ws
  }

  return connection
}
