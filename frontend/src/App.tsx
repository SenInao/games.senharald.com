import React, { useContext } from "react"
import Homepage from "./layout/homepage/Homepage"
import Chess from "./layout/chess/Chess"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./App.css"
import { WsContext } from "./ws/WsContext"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage/>
  },
  {
    path: "chess",
    element: <Chess/>
  }
])

const App: React.FC = () => {
  const wsContext = useContext(WsContext)
  if (!wsContext) {
    throw new Error("Context missing")
  }

  const {ws} = wsContext

  if (!ws) {
    return <div></div>
  }

  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
