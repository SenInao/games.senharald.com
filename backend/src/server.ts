import {WebSocketServer, WebSocket} from "ws"
import handler from "./handlers/actionHandler"

import dotenv from "dotenv"
import removeConnection from "./utils/removeConnection"
dotenv.config()

export type Connection = {
  id?: string
  ws: WebSocket
}

export interface Packet {
  id: string
  action: string
  payload: any
}

const usersConnected: Connection[] = []
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

const wss = new WebSocketServer({port})
console.log("Server running at ws//localhost:" + port)

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    try {
      console.log(usersConnected)
      const packet: Packet = JSON.parse(data.toString())
      handler(packet, ws, usersConnected)
    } catch (error) {
      console.log(error)
    }
  })

  ws.on("close", () => {
    removeConnection(ws, usersConnected)
  })

  ws.on("error", () => {
    removeConnection(ws, usersConnected)
  })
})
