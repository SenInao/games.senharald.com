import React from "react"
import { useNavigate } from "react-router-dom"
import BackgroundParticles from "../../components/backgroundParticles/BackgroundParticles"
import "./style.css"

const Homepage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="Homepage">
      <div className="content">
        <div className="menu">
          <h1>Games</h1>
          <div className="games-container">
            <button onClick={() => navigate("/chess")}>Chess</button>
            <button>Snake</button>
            <button>Sudoku</button>
          </div>
        </div>
      </div>
      <BackgroundParticles/>
    </div>
  )
}

export default Homepage
