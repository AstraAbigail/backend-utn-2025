// FUNCIONES QUE SANITIZAN DATOS DE ENTRADA Y RESPONDEN AL CLIENTE
// LA REQUEST Y EL RESPONSE SIEMPRE ESTARÁN SOLO EN LOS CONTROLLERS

import { Request, Response } from "express"
import PedidoModel  from "../model/PedidoModel"
import { Types } from "mongoose"
import { createPedidoSchema, updatedPedidoSchema } from "../validators/pedidoValidator"





class PedidosController {
  static getAllPedidos = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { n_pedido, nombre, identificacion, category, line, model, minCant, maxCant, estado} = req.query
      console.log(req.query)

      const filter: any = {}

      if (n_pedido) filter.n_pedido = Number(n_pedido)
      if (nombre) filter['cliente.nombre'] = new RegExp(String(nombre), "i")
      if (identificacion) filter['cliente.identificacion'] = new RegExp(String(identificacion))
      if (category) filter['productos.category']= new RegExp(String(category), "i")
      if (line) filter['productos.line'] = new RegExp(String(line), "i")
      if (model) filter['productos.model'] = new RegExp(String(model), "i")
      if (minCant || maxCant) {
        filter['productos.cantidad'] = {}
        // maxPrice -> si tengo precio máximo quiero un objeto con un precio menor
        if (minCant) filter['productos.cantidad'].$gte = Number(minCant)
        // minPrice -> si tengo un precio mínimo quiero un objeto con un precio mas grande.
        if (maxCant) filter['productos.cantidad'].$lte = Number(maxCant)
      }
      if (estado) filter.estado= String(estado)

      const pedidos = await PedidoModel.find(filter)
      console.log("Pedidos encontrados:", pedidos.length)
      res.json({ success: true, data: pedidos })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static getPedido = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "ID Inválido" })
      }

      const product = await PedidoModel.findById(id)

      if (!product) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }

      res.status(200).json({ success: true, data: product })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static addPedido = async (req: Request, res: Response): Promise<void | Response> => {
    
    try {
      const { body } = req;

      //Zod
      const validator = createPedidoSchema.safeParse(body);

      if (!validator.success) {
        return res.status(400).json({
          success: false,
          error: validator.error.flatten().fieldErrors,
        });
      }
      //destructuro despues de zod
      const {
        n_pedido,
        cliente,
        estado,
        productos
      } = validator.data

      
      const newPedido = new PedidoModel({
        n_pedido,
        cliente,
        estado,
        productos
      })
        
      await newPedido.save()

      return res.status(201).json({
        success: true,
        data: newPedido,
      })
      


    } catch (e) {
      const error = e as Error;
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  

  static updatePedido = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { id } = req.params
      const { indice, productoUpdate } = req.body


      console.log(indice, productoUpdate, "DESDE EL BACK ")
      if (!Types.ObjectId.isValid(id)) res.status(400).json({ succes: false, error: "ID Inválido" })
      // Asegurarse de que el índice sea un número válido
      if (typeof indice !== 'number' || indice < 0) {
          return res.status(400).json({succes: false, error: "Indice Inválido"  });
      }
      const validator = updatedPedidoSchema.safeParse(productoUpdate)

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
      }

      ////////////////
      const updateOperation: Record<string, any> = {}
      
      if (productoUpdate.category === "Exterior") {
           productoUpdate.marco = "Marco estándar"
      }
        // 1. Construir la operación $set usando el índice
        // Ejemplo: si indice=0, el campo es 'productos.0.cantidad'
        for (const key in  productoUpdate ) {
            updateOperation[`productos.${indice}.${key}`] =  productoUpdate[key];
        }

        const pedidoActualizado = await PedidoModel.findByIdAndUpdate(
            id,
            { $set: updateOperation },
            { new: true } 
        )
          console.log(pedidoActualizado,"PEDIDO ACTUALIZADO")
        if (!pedidoActualizado){
            return res.status(404).json({success: false,error: "Pedido no encontrado." })
        }

        res.status(200).json({ success: true, data: pedidoActualizado })
      ////////////////

      // const updatedPedido = await PedidoModel.findByIdAndUpdate(id, validator.data, { new: true })

      // if (!updatedPedido) {
      //   return res.status(404).json({ success: false, error: "Producto no encontrado" })
      // }

      // res.json({ success: true, data: updatedPedido })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static deletePedido = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const id = req.params.id

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID Inválido" });
      }

      const deletedPedido = await PedidoModel.findByIdAndDelete(id)

      if (!deletedPedido) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }

      res.json({ success: true, data: deletedPedido })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ error: error.message })
    }
  }
}

export default PedidosController