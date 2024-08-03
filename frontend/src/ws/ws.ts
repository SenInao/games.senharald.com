const CONNECTING = 0
const CONNECTED = 1
const ERROR = 2
const CLOSE = 3

interface Packet {
  action: String,
  payload?: any
}

class WS {
  url : string
  ws : WebSocket | undefined
  state : number
  msgCallback : (packet:Packet) => any

  constructor(url:string) {
    this.url = url
    this.state = CONNECTING
    this.msgCallback = () => {}
    this.connect()
  };

  async connect() {
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      this.state = CONNECTED
      const packet: Packet = {action: "register", payload: {username: "Sen"}}
      this.send(packet)
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
        this.msgCallback(packet)

      } catch (error) {
        console.log(error)
        console.log(msg.data)
      }
    }
  }

  send(packet: Packet) {
    if (this.ws) {
      this.ws.send(JSON.stringify(packet))
    }
  }
}

export default WS
