import { useRef, useEffect } from "react"
import { User } from "../../ws/WsContext"
import {PreviousGameStatInterface} from "./PreviousGameStat"
import GameShowcase from "./ShowcaseGame.script"
import "./ShowcaseGame.style.css"

interface Props {
  previousGameStat : PreviousGameStatInterface
  setStatIndex : (i: number) => void
  user: User
}

const ShowcaseGame:React.FC<Props> = ({previousGameStat, setStatIndex, user}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  var game : GameShowcase
  var opp
  var winner
  var nameYou
  var nameOpp

  if (previousGameStat.player1 === user.username) {
    opp = previousGameStat.player2
  } else {
    opp = previousGameStat.player1
  }

  if (previousGameStat.winner === "draw") {
    nameYou = "draw-name"
    nameOpp = "draw-name"
  } else if (previousGameStat.winner === opp) {
    nameYou = "red-name"
    nameOpp = "green-name"
  } else {
    nameOpp = "red-name"
    nameYou = "green-name"
  }

  useEffect(() => {
    if (!canvasRef.current) return
    const context = canvasRef.current.getContext("2d")
    if (!context) return

    game = new GameShowcase(previousGameStat.moves, context, canvasRef.current, false)
  }, [])

  return (
    <div className="ChessGame">
      <section>
        <div className={nameYou}>You</div>
        <div className="name">VS</div>
        <div className={nameOpp}>{opp}</div>
      </section>
      <canvas ref={canvasRef}></canvas>
      <section>
        <button onClick={() => game.nextMove()}>{"<"}</button>
        <button onClick={() => game.previousMove()}>{">"}</button>
        <button onClick={() => setStatIndex(-1)}>Back</button>
      </section>
    </div>
  )
}

export default ShowcaseGame
