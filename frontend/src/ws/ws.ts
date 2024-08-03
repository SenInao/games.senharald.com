const CONNECTING = 0
const CONNECTED = 1
const ERROR = 2
const CLOSE = 3

interface WsRequest {
  id: number,
  callBack: (packet:Packet) => any
}

interface Packet {
  id: number
  action: String,
  payload: any
}

class WS {
  url : string
  ws : WebSocket | undefined
  state : number
  pendingRequests : WsRequest[]

  constructor(url:string) {
    this.url = url
    this.state = CONNECTING
    this.pendingRequests = []

    this.connect()
  };

  async connect() {
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      this.state = CONNECTED
      this.send("register", {username: "Sen"})
    }

    this.ws.onerror = () => {
      this.state = ERROR
    }

    this.ws.close = () => {
      this.state = CLOSE
    }

    this.ws.onmessage = (msg) => {
      try {
        const packet: Packet= JSON.parse(msg.data)
        this.resolvePacket(packet)

      } catch (error) {
        console.log(error)
        console.log(msg.data)
      }
    }
  }

  resolvePacket(packet: Packet) {
    for (let i = 0; i < this.pendingRequests.length; i++) {
      if (packet.id === this.pendingRequests[i].id) {
        this.pendingRequests[i].callBack(packet)
        this.pendingRequests.splice(i, 0)
        break
      }
    }
  }

  generateRequestId() {
    let id = 0
    while (true) {
      for (let i = 0; i < this.pendingRequests.length; i++) {
        if (id === this.pendingRequests[i].id) {
          id+=1
          continue
        }
      }
      break
    }

    return id
  }

  send(action: string, payload: any, callBack: (packet: Packet) => any = () => {}) {
    if (this.ws) {
      const id = this.generateRequestId()

      const wsRequest: WsRequest = {
        id: id,
        callBack: callBack
      }

      this.pendingRequests.push(wsRequest)

      const packet: Packet = {
        id: id,
        action: action,
        payload: payload
      }

      this.ws.send(JSON.stringify(packet))
    }
  }
}

export default WS
