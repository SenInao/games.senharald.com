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
              <label>You vs Tom</label>
              <label className="lost-label">Lost</label>
            </li>
            <li>
              <label>21/09/24</label>
              <label>You vs Tom</label>
              <label className="won-label">Won</label>
            </li>
            <li>
              <label>21/09/24</label>
              <label>You vs Tom</label>
              <label className="draw-label">Draw</label>
            </li>
          </ul>
        </section>
        <section className="matchmaking">
          <button>Play 3 min</button>
          <button>Play 5 min</button>
          <button>Play 10 min</button>
        </section>
      </div>
    </div>
  )
}

export default Chess
