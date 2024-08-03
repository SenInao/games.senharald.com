import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { WsContext } from "../../ws/WsContext"
import "./style.css"

const Chess:React.FC = () => {
  const navigate = useNavigate()
  const wsContext = useContext(WsContext)
  if (!wsContext) {
    throw new Error("Context missing")
  }

  const {ws} = wsContext
  
  function matchmake(min: string) {
    if (!ws) return
    ws.send("chess-matchmake"+min, {}, () => (console.log("Added to matchmaking")))
  }

  return (
    <div className="chess">
      <header>
        <h1>Chess</h1>
        <button onClick={() => navigate("/")}>Back</button>
      </header>
      <div className="chess-content">
        <section className="stats">
          <ul>
            <h1>Previous matches</h1>
            <li>
              <label>21/09/24</label>
              <label>|</label>
              <label>You vs Tom</label>
              <label>|</label>
              <label className="lost-label">Lost</label>
            </li>
            <li>
              <label>21/09/24</label>
              <label>|</label>
              <label>You vs Tom</label>
              <label>|</label>
              <label className="won-label">Won</label>
            </li>
            <li>
              <label>21/09/24</label>
              <label>|</label>
              <label>You vs Tom</label>
              <label>|</label>
              <label className="draw-label">Draw</label>
            </li>
          </ul>
        </section>
        <section className="matchmaking">
          <button onClick={() => matchmake("3min")}>Play 3 min</button>
          <button onClick={() => matchmake("5min")}>Play 5 min</button>
          <button onClick={() => matchmake("10min")}>Play 10 min</button>
        </section>
      </div>
    </div>
  )
}

export default Chess
