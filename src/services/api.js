// src/services/api.js

const API_URL = 'http://localhost:5000';

export const apiService = {
  registrarCliente: async (datosCliente) => {
    try {
      const response = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCliente),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al registrar el cliente');
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },

  loginCliente: async (correo, contrasena) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo_electronico: correo, contrasena: contrasena }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Credenciales incorrectas');
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },

  obtenerProductos: async () => {
    try {
      const response = await fetch(`${API_URL}/producto`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al obtener los productos');
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },

  obtenerCarrito: async (idCliente) => {
    try {
      const response = await fetch(`${API_URL}/carrito/${idCliente}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al cargar el carrito');
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },

  agregarAlCarrito: async (payload) => {
    try {
      const response = await fetch(`${API_URL}/carrito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al agregar producto al carrito');
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },

  eliminarDelCarrito: async (idCliente, idProducto) => {
    try {
      const response = await fetch(`${API_URL}/carrito/eliminar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_cliente: idCliente, id_producto: idProducto }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al eliminar el producto del carrito');
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },

  crearPedido: async (idCliente, total) => {
    try {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_cliente: idCliente, total: parseFloat(total) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al dar de alta el pedido');
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },

  procesarPago: async (idPedido, monto, metodoPago = 'Tarjeta de Crédito') => {
    try {
      const response = await fetch(`${API_URL}/pagos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_pedido: idPedido, monto: parseFloat(monto), metodo_pago: metodoPago })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al asentar la transacción bancaria');
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },

  vaciarCarrito: async (idCliente) => {
    try {
      const response = await fetch(`${API_URL}/carrito/vaciar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_cliente: idCliente })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al vaciar los datos temporales');
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },
};