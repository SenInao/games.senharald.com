import { Connection } from "../../ws/ws"
import Piece from "./Piece"
import Game from "./Game"

export default class Player {
  connection: Connection
  username : string

  king: Piece
  inCheck : boolean
  white: boolean
  turn: boolean
  winner : boolean

  clock : number
  timerId : number | undefined | NodeJS.Timeout

  constructor(connection: Connection, white: boolean) {
    this.connection = connection
    if (connection.user) {
      this.username = connection.user.username
    } else {
      this.username = "Guest"
    }
    this.white = white
    this.turn = white
    this.king = new Piece(0,0,true)
    this.inCheck = false
    this.clock = 0
    this.winner = false
  }

  startTimer(game: Game) {
    game.broadcast("timerUpdate", {player: this.connection.id, time : this.clock})
    this.timerId = setInterval(() => {
      this.clock--
      game.broadcast("timerUpdate", {player: this.connection.id, time : this.clock})
      
      if (this.clock <= 0) {
        if (game.player1.connection.id === this.connection.id) {
          game.winner = game.player2.connection.id
          game.player2.winner = true
        } else {
          game.winner = game.player1.connection.id
          game.player1.winner = true
        }
        game.endGame()
        clearInterval(this.timerId)
        this.timerId = undefined
      }
    }, 1000)
  }

  stopTimer() {
    clearInterval(this.timerId)
    this.timerId = undefined
  }
}
