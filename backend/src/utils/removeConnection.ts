import { WebSocket } from "ws";
import { Connection } from "./../ws/ws"

export function removeConnectionFromList(ws: WebSocket, list: Connection[]) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].ws === ws) {
      list.splice(i, 1)
      break
    }
  }
}
