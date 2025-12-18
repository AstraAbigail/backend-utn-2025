import { z } from "zod"


const clienteSchema = z.object({
  nombre: z.string().min(3),
  identificacion: z.string().min(8),
  domicilio: z.string().min(10)
});

const productoSchema = z.object({
  cantidad: z.number().min(1),
  category: z.string(),
  line: z.string(),
  model: z.string(),
  marco: z.string().optional(),
  color: z.string(),
  mano: z.string(),
  precio: z.number().min(1)
});



export const createPedidoSchema = z.object({
  n_pedido: z.number().min(6),
  cliente: clienteSchema,
  estado: z.string(),
  productos: z.array(productoSchema).min(1)
});

export const updatedPedidoSchema = createPedidoSchema.partial()

export const updateProductoSchema = productoSchema.partial()

export const updateEstadoSchema = z.object({ estado: z.string()})


