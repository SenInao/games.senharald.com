import {useContext} from "react"
import { User, WsContext } from "../../ws/WsContext"

interface Pos {
  x: number
  y: number
  specialMove : string

}

interface Move {
  oldPos: Pos,
  newPos: Pos
}

export interface PreviousGameStatInterface {
  moves: Move[]
  player1: {username: string, white: boolean}
  player2: {username: string, white: boolean}
  winner: string
  date: string
}

interface Props {
  previousGameStat : PreviousGameStatInterface
  user: User
  setStatIndex : (i: number) => void
  i : number
}

const PreviousGameStat : React.FC<Props> = ({previousGameStat, user, setStatIndex, i}) => {
  const wsContext = useContext(WsContext)
  if (!wsContext) throw new Error("Context missing")
  let opp
  let label = "draw"

  if (previousGameStat.player1.username === user.username) {
    opp = previousGameStat.player2
  } else {
    opp = previousGameStat.player1
  }

  if (previousGameStat.winner === user.username) {
    label = "won"
  } else if (previousGameStat.winner === opp.username) {
    label = "lost"
  }

  return (
    <li onClick={() => setStatIndex(i)}>
      <label>{previousGameStat.date.split("T")[0].replace("-", "/")}</label>
      <label>|</label>
      <label>you vs {opp.username}</label>
      <label>|</label>
      <label className={label + "-label"}>{label}</label>
    </li>
  )
}

export default PreviousGameStat
