import { createContext, ReactNode, useEffect, useState } from "react"
import { PreviousGameStatInterface } from "../components/chess/PreviousGameStat"
import { getUser } from "../utils/getUser"
import WS from "./ws"

interface WsContextType {
  ws: WS | null
  setWs: (ws:WS) => void
  user : User | null
  setUser : (user: User) => void
}

export interface User {
  username : string
  previousGames? : PreviousGameStatInterface[]
}

const WsContext = createContext<WsContextType | undefined>(undefined)

interface WsProviderProps {
  children: ReactNode
}

const WsProvider: React.FC<WsProviderProps> = ({children}) => {
  const [ws, setWs] = useState<WS | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    getUser().then((user) => {
      console.log(user)
      if (!user) {
        const newWs = new WS(`ws://${window.location.hostname}:8082`, null)
        setWs(newWs)
      } else {
        setUser(user)
        const newWs = new WS(`ws://${window.location.hostname}:8082`, user._id)
        setWs(newWs)
      }
    })

    return ( ) => {
      if (ws) {
        if (ws.ws) {
          ws.ws.close()
        }
      }
    }
  }, [])

  return (
    <WsContext.Provider value={{ws, setWs, user, setUser}}>
      {children}
    </WsContext.Provider>
  )
}

export {WsContext, WsProvider}
