import { Schema, model } from "mongoose"
import { IPedido } from "../interfaces/IPedido"

// === PRODUCTO (subdocumento) ===
const ProductoSchema = new Schema(
  {
    cantidad: { type: Number, required: true },
    category: { type: String, required: true },
    line: { type: String, required: true },
    model: { type: String, required: true },
    marco: { type: String, default: "" }, //opcional
    color: { type: String, required: true },
    mano: { type: String, required: true },
    precio: { type: Number, required: true }
  },
  { _id: false } // evita crear _id por cada producto
);


const ClienteSchema = new Schema(
  {
    nombre: { type: String, required: true },
    identificacion: { type: String, required: true },
    domicilio: { type: String, required: true }
  },
  { _id: false }
);


const PedidoSchema = new Schema<IPedido>(
  {
    n_pedido: { type: Number, required: true, unique: true },
    cliente: { type: ClienteSchema, required: true },
    estado: { type: String, required: true },
    productos: { type: [ProductoSchema], required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const PedidoModel = model<IPedido>("Pedido", PedidoSchema)

export default PedidoModel