import dotenv from "dotenv"
dotenv.config()

import dbConnect from "./config/db"
dbConnect()

import WS from "./ws/ws"

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

const ws = new WS(port)
ws.createServer()
