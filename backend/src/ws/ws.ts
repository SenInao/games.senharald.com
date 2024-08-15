import { WebSocket, WebSocketServer } from "ws"
import Game from "../models/chess/Game"
import User from "../models/user/User"
import chessHandler from "../handlers/chessHandler"
import { removeConnectionFromList } from "../utils/removeConnection"
import { fiveMinQeue, tenMinQeue, threeMinQeue } from "../states/chess/state"

interface chessInfo {
  inGame : boolean
  inQeue : boolean
  game : Game | null
}

export interface Connection {
  id: number
  user: any
  ws: WebSocket
  chess : chessInfo
}

export interface Packet {
  id: number
  action: string
  payload: any
}

export default class WS {
  port : number
  connections : Connection[]
  wss : WebSocketServer | undefined

  constructor(port: number) {
    this.port = port
    this.connections = []
  }

  createServer() {
    this.wss = new WebSocketServer({port : this.port})
    console.log("Server running at ws//localhost:" + this.port)

    this.wss.on("connection", (ws) => {
      ws.on("message", async (data) => {
        try {
          const packet: Packet = JSON.parse(data.toString())
          const returnPacket = await this.packetHandler(packet, ws)
          if (returnPacket) {
            ws.send(JSON.stringify(returnPacket))
          }
        } catch (error) {
          console.log(error)
        }
      })

      ws.on("close", () => {
        this.chessCleanup(ws)
        this.removeConnection(ws)
      })

      ws.on("error", () => {
        this.chessCleanup(ws)
        this.removeConnection(ws)
      })
    })
  }

  async packetHandler(packet: Packet, ws : WebSocket) {
    try {
      let action = packet.action.split("-")
      if (action[0] === "register") {
        const connnection = await this.register(packet, ws)
        this.connections.push(connnection)
        return {
          id: packet.id,
          action: packet.action,
          payload: {status: true, id: connnection.id}
        }

      } else if (action[0] === "chess") {
        action.splice(0, 1)
        packet.action = action.toString()
        const connection = this.findConnectionByWs(ws)
        if (!connection) {
          throw new Error("Not connected")
        }
        return await chessHandler(packet, connection, this)
      }
    } catch (error: any) {
      console.log(error)

      const returnPacket: Packet = {
        id: packet.id,
        action: packet.action,
        payload: {status: false, error: error.message}
      }

      ws.send(JSON.stringify(returnPacket))
    }
  }

  findConnectionByWs(ws: WebSocket) {
    for (let i = 0; i < this.connections.length; i++) {
      if (this.connections[i].ws === ws) {
        return this.connections[i]
      }
    }
  }

  generateId() {
    var id = 1
    while (true) {
      for (let i = 0; i < this.connections.length; i++) {
        if (id === this.connections[i].id) {
          id+=1
          continue
        }
      }
      break
    }
    return id
  }

  async register(packet : Packet, ws : WebSocket) {
    console.log(packet)
    const user = await User.findById(packet.payload.userId)
    const connection: Connection = {
      id: this.generateId(),
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

  chessCleanup(ws : WebSocket) {
    const connection = this.findConnectionByWs(ws)
    if (connection) {
      connection.chess.game?.leaveGame(connection.id)
      removeConnectionFromList(ws, threeMinQeue)
      removeConnectionFromList(ws, fiveMinQeue)
      removeConnectionFromList(ws, tenMinQeue)
    }
  }

  removeConnection(ws : WebSocket) {
    for (let i = 0; i < this.connections.length; i++) {
      if (this.connections[i].ws === ws) {
        this.connections.splice(i, 1)
        break
      }
    }
  }
}
