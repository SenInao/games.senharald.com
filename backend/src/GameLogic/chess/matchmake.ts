import Game from "../../models/chess/Game";
import Player from "../../models/chess/Player";
import WS, { Connection } from "../../ws/ws";
import {tenMinQeue, fiveMinQeue, threeMinQeue} from "./../../states/chess/state"

export default function matchmake(ws : WS) {
  if (threeMinQeue.length >= 2) {
    if (threeMinQeue[0].user && threeMinQeue[1].user && threeMinQeue[0].user._id.equals(threeMinQeue[1].user._id)) return
    createGame(threeMinQeue[0], threeMinQeue[1], 3, ws)
    threeMinQeue.splice(0,1)
    threeMinQeue.splice(0,1)
  } 

  if (fiveMinQeue.length >= 2) {
    if (fiveMinQeue[0].user && fiveMinQeue[1].user && fiveMinQeue[0].user._id.equals(fiveMinQeue[1].user._id)) return
    createGame(fiveMinQeue[0], fiveMinQeue[1], 5, ws)
    fiveMinQeue.splice(0,1)
    fiveMinQeue.splice(0,1)
  } 

  if (tenMinQeue.length >= 2) {
    if (tenMinQeue[0].user && tenMinQeue[1].user && tenMinQeue[0].user._id.equals(tenMinQeue[1].user._id)) return
    createGame(tenMinQeue[0], tenMinQeue[1], 10, ws)
    tenMinQeue.splice(0,1)
    tenMinQeue.splice(0,1)
  }
}

function createGame(connection1: Connection, connection2: Connection, duration: number, ws : WS) {
  const white = Math.round(Math.random())
  const player1 = new Player(connection1, white === 0)
  const player2 = new Player(connection2, white === 1)
  const game = new Game(player1, player2, duration, ws)

  connection1.chess.inQeue = false
  connection2.chess.inQeue = false
  connection1.chess.game = game
  connection2.chess.game = game
}
