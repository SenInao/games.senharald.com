import {useContext} from "react"
import { User, WsContext } from "../../ws/WsContext"

interface Move {
  x: number
  y: number
}

export interface PreviousGameStatInterface {
  moves: Move[]
  player1: string
  player2: string
  winner: string
  date: string
}

interface Props {
  previousGameStat : PreviousGameStatInterface
  user: User
}

const PreviousGameStat : React.FC<Props> = ({previousGameStat, user}) => {
  const wsContext = useContext(WsContext)
  if (!wsContext) throw new Error("Context missing")
  let opp
  let label = "draw"

  if (previousGameStat.player1 === user.username) {
    opp = previousGameStat.player2
  } else {
    opp = previousGameStat.player1
  }

  if (previousGameStat.winner === user.username) {
    label = "won"
  } else if (previousGameStat.winner === opp) {
    label = "lost"
  }

  return (
    <li>
      <label>{previousGameStat.date.split("T")[0].replace("-", "/")}</label>
      <label>|</label>
      <label>you vs {opp}</label>
      <label>|</label>
      <label className={label + "-label"}>{label}</label>
    </li>
  )
}

export default PreviousGameStat
