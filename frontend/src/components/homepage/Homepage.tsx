import React from "react"
import "./style.css"

import BackgroundParticles from "./../backgroundParticles/BackgroundParticles"

const Homepage: React.FC = () => {
  return (
    <div className="Homepage">
      <div className="content">
        <div className="menu">
          <h1>Games</h1>
          <div className="games-container">
            <button>Chess</button>
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
