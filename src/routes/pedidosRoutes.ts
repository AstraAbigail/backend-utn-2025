// EL ROUTER VALIDA METODOS Y RUTAS PROPIAS DE LA ENTIDAD

// GET http://localhost:3000/product

import { Router } from "express"
import PedidosController from "../controllers/pedidosController"
import authMiddleware from "../middleware/authMiddleware"
import upload from "../middleware/uploadMiddleware"

const pedidosRouter = Router()

// TODAS LAS PETICIONES QUE LLEGAN AL PRODUCTROUTER EMPIEZAN CON
// POST http://localhost:3000/products/

pedidosRouter.get("/", PedidosController.getAllPedidos)
pedidosRouter.get("/:id", PedidosController.getPedido)
pedidosRouter.post("/", authMiddleware,PedidosController.addPedido)
pedidosRouter.patch("/:id", authMiddleware, PedidosController.updatePedido)
pedidosRouter.delete("/:id", authMiddleware, PedidosController.deletePedido)

export default pedidosRouter