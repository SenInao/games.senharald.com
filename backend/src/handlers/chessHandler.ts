import { threeMinQeue, fiveMinQeue, tenMinQeue } from "../states/chess/state"
import matchmake from "../GameLogic/chess/matchmake"
import { removeConnectionFromList } from "../utils/removeConnection"
import WS, {Packet, Connection} from "../ws/ws"

export default async function chessHandler(packet: Packet, connection: Connection, ws : WS) {
  if (packet.action === "matchmake") {
    if (connection.chess.inQeue || connection.chess.inGame) {throw new Error("already in qeue")}
    if (packet.payload.min === 3) {
      threeMinQeue.push(connection)
    } else if (packet.payload.min === 5) {
      fiveMinQeue.push(connection)
    } else if (packet.payload.min === 10) {
      tenMinQeue.push(connection)
    } else {
      throw new Error("minutes not defined")
    }
    connection.chess.inQeue = true
    matchmake(ws)

  } else if (packet.action === "matchmakeCancel") {
    removeConnectionFromList(connection.ws, threeMinQeue)
    removeConnectionFromList(connection.ws, fiveMinQeue)
    removeConnectionFromList(connection.ws, tenMinQeue)
    connection.chess.inQeue = false

  } else if (packet.action === "getGamestate") {
    if (!connection.chess.game) {
      throw new Error("not in game")
    }
    const payload = connection.chess.game?.gameState()
    return {
      id: packet.id,
      action: "getGamestate",
      payload: payload
    }

  } else if (packet.action === "move") {
    const game = connection.chess.game
    if (!game) {
      throw new Error("not in game")
    }
    game.validateChessMove(connection.id, packet.payload)
    game.broadcastGamestate()
  }

  return {
    id: packet.id,
    action: packet.action,
    payload: {status: true}
  }
}
