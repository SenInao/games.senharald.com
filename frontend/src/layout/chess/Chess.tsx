import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import PreviousGameStat, { PreviousGameStatInterface } from "../../components/chess/PreviousGameStat"
import { WsContext } from "../../ws/WsContext"
import "./style.css"

const Chess:React.FC = () => {
  const [matchmaking, setMatchmaking] = useState<boolean>(false)

  const navigate = useNavigate()
  const wsContext = useContext(WsContext)
  if (!wsContext) {
    throw new Error("Context missing")
  }

  const {ws, user} = wsContext
  if (ws) {
    ws.defaultHandler = handler
  }

  function cancelMatchmake() {
    if (!ws) return
    ws.send("chess-matchmakeCancel", {})
    setMatchmaking(false)
  }
  
  function matchmake(min: number) {
    if (!ws) return
    ws.send("chess-matchmake", {min: min})
    setMatchmaking(true)
  }

  function handler() {
    navigate("/chess/game")
  }

  function getPreviousGames() {
    console.log(user)
    if (!user) return []
    if (!user.previousGames) return []
    const gamesStats:PreviousGameStatInterface[] = []
    user.previousGames.forEach((gamesStat: PreviousGameStatInterface) => {
      gamesStats.push(gamesStat)
    })

    return gamesStats
  }

  if (matchmaking) {
    return (
      <div className="matchmaking-wait">
        <h1>Matchmaking ...</h1>
        <button onClick={() => cancelMatchmake()}>Cancel</button>
      </div>
    )
  }

  return (
    <div className="chess">
      <header>
        <h1>Chess</h1>
        <button onClick={() => navigate("/")}>Back</button>
      </header>
      {ws? (
        <div className="chess-content">
          <section className="stats">
            <ul>
              <h1>Previous matches</h1>
              {user ? getPreviousGames().map((gameStat: PreviousGameStatInterface) => {
                return <PreviousGameStat user={user} previousGameStat={gameStat}/>
              }) : (
                  <div>
                    <button>Log In</button>
                    <button>Register</button>
                  </div>
                )}
            </ul>
          </section>
          <section className="matchmaking">
            <button onClick={() => matchmake(3)}>Play 3 min</button>
            <button onClick={() => matchmake(5)}>Play 5 min</button>
            <button onClick={() => matchmake(10)}>Play 10 min</button>
          </section>
        </div>
      ) : (
      <div className="loading-user">
        <h1>Loading ...</h1>
      </div>
      )}
    </div>
  )
}

export default Chess
