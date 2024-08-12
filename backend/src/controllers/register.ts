import { WebSocket } from "ws"
import {Connection, Packet} from "./../server"
import User from "../models/User/user"

function generateId(connections: Connection[]) {
  var id = 1
  while (true) {
    for (let i = 0; i < connections.length; i++) {
      if (id === connections[i].id) {
        id+=1
        continue
      }
    }
    break
  }
  return id
}

export default async function register(packet: Packet, ws: WebSocket, connections: Connection[]) {
  console.log(packet)
  const user = await User.findById(packet.payload.userId)
  const connection: Connection = {
    id: generateId(connections),
    user: user,
    ws: ws,
    chess : {
      inQeue : false,
      inGame : false,
      game : null,
    }
  }

  return connection
}
