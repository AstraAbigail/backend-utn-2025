
interface IProducto {
  cantidad: number;
  category: string;
  line: string;
  model: string;
  marco?: string;
  color: string;
  mano: string;
  precio: number;
}

interface ICliente {
  nombre: string;
  identificacion: string;
  domicilio: string;
}

interface IPedido {
  n_pedido: number;
  cliente: ICliente;
  estado: string;
  productos: IProducto[];
}

export  {IProducto, ICliente, IPedido}