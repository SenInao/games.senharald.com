import React from "react"
import Homepage from "./layout/homepage/Homepage"
import Chess from "./layout/chess/Chess"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./App.css"
import Game from "./layout/chess/Game"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage/>
  },
  {
    path: "chess",
    element: <Chess/>
  },
  {
    path: "chess/game",
    element: <Game/>
  }
])

const App: React.FC = () => {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
