// FUNCIONES QUE SANITIZAN DATOS DE ENTRADA Y RESPONDEN AL CLIENTE
// LA REQUEST Y EL RESPONSE SIEMPRE ESTARÁN SOLO EN LOS CONTROLLERS

import { Request, Response } from "express"
import PedidoModel  from "../model/PedidoModel"
import { Types } from "mongoose"
import { createPedidoSchema, updatedPedidoSchema } from "../validators/pedidoValidator"





class PedidosController {
  static getAllPedidos = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { name, stock, category, minPrice, maxPrice } = req.query
      console.log(req.query)

      const filter: any = {}

      if (name) filter.name = new RegExp(String(name), "i")
      if (stock) filter.stock = Number(stock)
      if (category) filter.category = new RegExp(String(category), "i")
      if (minPrice || maxPrice) {
        filter.price = {}
        // maxPrice -> si tengo precio máximo quiero un objeto con un precio menor
        if (minPrice) filter.price.$gte = minPrice
        // minPrice -> si tengo un precio mínimo quiero un objeto con un precio mas grande.
        if (maxPrice) filter.price.$lte = maxPrice
      }

      const products = await PedidoModel.find(filter)
      res.json({ success: true, data: products })
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

  // static addPedido = async (req: Request, res: Response): Promise<void | Response> => {
  //   try {
  //     const { body } = req

  //     const { name, description, price, category, stock } = body

  //     if (!name || !description || !price || !category || !stock) {
  //       return res.status(400).json({ message: "Todos los campos son requeridos" })
  //     }

  //     const dataToValidate = {
  //       n_pedido: "",
  //       nombre: "",
  //       identificacion: "",
  //       domicilio: "",
  //       estado: "",
  //       cantidad: "",
  //       category: "",
  //       line: "",
  //       model: "",
  //       marco: "",
  //       color: "",
  //       mano: "",
  //       precio: ""
        
  //     }

  //     const validator = createPedidoSchema.safeParse(dataToValidate)

  //     if (!validator.success) {
  //       return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
  //     }

  //     const newPedido = new PedidoModel(validator.data)

  //     await newPedido.save()
  //     res.status(201).json({ success: true, data: newPedido })
  //   } catch (e) {
  //     const error = e as Error
  //     res.status(500).json({ success: false, error: error.message })
  //   }
  // }

  static updatePedido = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { id } = req.params
      const { body } = req

      if (!Types.ObjectId.isValid(id)) res.status(400).json({ succes: false, error: "ID Inválido" })

      const validator = updatedPedidoSchema.safeParse(body)

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
      }

      const updatedPedido = await PedidoModel.findByIdAndUpdate(id, validator.data, { new: true })

      if (!updatedPedido) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }

      res.json({ success: true, data: updatedPedido })
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