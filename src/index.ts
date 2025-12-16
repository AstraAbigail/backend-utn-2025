// LEVANTAR NUESTRO SERIVICIO Y CONFIGURACIONES GLOBALES
import express, { Request, Response } from "express"
import cors from "cors"
import connectDB from "./config/mongodb"
import pedidosRouter from "./routes/pedidosRoutes"
import authRouter from "./routes/authRouter"
import morgan from "morgan"
import IUserTokenPayload from "./interfaces/IUserTokenPayload"
import dotenv from "dotenv"
import logger from "./config/logger"
import path from "node:path"
import fs from "node:fs"


dotenv.config()

declare global {
  namespace Express {
    interface Request {
      user?: IUserTokenPayload
    }
  }
}

const PORT = process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

const uploadsPath = path.join(__dirname, "../uploads")

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}

// app.use("/uploads", express.static(uploadsPath))

app.use(morgan("dev"))

app.get("/", (__: Request, res: Response) => {
  res.json({ status: true })
})

app.use("/auth", authRouter)
// http://localhost:3000/pedido/auth
app.use("/pedidos", pedidosRouter)



// endpoint para el 404 - no se encuentra el recurso
app.use((__, res) => {
  res.status(404).json({ success: false, error: "El recurso no se encuentra" })
})

// servidor en escucha
app.listen(PORT, () => {
  console.log(`✅ Servidor en escucha en el puerto http://localhost:${PORT}`)
  connectDB()
})

//probando git que piro.
