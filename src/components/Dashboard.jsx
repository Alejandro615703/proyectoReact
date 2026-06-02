import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import ProductoTarjeta from './ProductoTarjeta';

export default function Dashboard({ usuario, idCliente, onLogout }) {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const inicializarTienda = async () => {
      try {
        const productosData = await apiService.obtenerProductos();
        if (productosData.error) setError(productosData.error);
        else setProductos(productosData);

        const carritoData = await apiService.obtenerCarrito(idCliente);
        if (!carritoData.error) setCarrito(carritoData);
      } catch (err) {
        setError('Error de comunicación con el servidor local.');
      }
    };
    inicializarTienda();
  }, [idCliente]);

  const handleAgregarAlCarrito = async (producto) => {
    setMensaje('');
    setError('');

    const payload = { id_cliente: idCliente, id_producto: producto.id_producto, cantidad: 1 };
    const resultado = await apiService.agregarAlCarrito(payload);

    if (resultado && resultado.error) {
      setError(resultado.error);
    } else {
      setCarrito((prevCarrito) => {
        const existe = prevCarrito.find(item => item.id_producto === producto.id_producto);
        if (existe) {
          return prevCarrito.map(item => 
            item.id_producto === producto.id_producto ? { ...item, cantidad: Number(item.cantidad || 0) + 1 } : item
          );
        }
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      });
      setMensaje(`¡${producto.nombre} añadido al carrito!`);
      setTimeout(() => setMensaje(''), 2000);
    }
  };

  const handleEliminarDelCarrito = async (idProducto, nombreProducto) => {
    setMensaje('');
    setError('');

    const resultado = await apiService.eliminarDelCarrito(idCliente, idProducto);

    if (resultado && resultado.error) {
      setError(resultado.error);
    } else {
      setCarrito((prevCarrito) => prevCarrito.filter(item => item.id_producto !== idProducto));
      setMensaje(`Se removió "${nombreProducto}" de tu carrito.`);
      setTimeout(() => setMensaje(''), 2000);
    }
  };

  const handleProcesarCompra = async () => {
    if (carrito.length === 0) return;
    
    setCargando(true);
    setError('');
    setMensaje('');

    const totalCompra = calcularTotalPrecio();

    const pedidoResultado = await apiService.crearPedido(idCliente, totalCompra);
    if (pedidoResultado.error) {
      setError(`Error al registrar el pedido: ${pedidoResultado.error}`);
      setCargando(false);
      return;
    }

    const idPedidoGenerado = pedidoResultado.id_pedido;

    const pagoResultado = await apiService.procesarPago(idPedidoGenerado, totalCompra);
    if (pagoResultado.error) {
      setError(`Pedido #${idPedidoGenerado} creado, pero falló el pago: ${pagoResultado.error}`);
      setCargando(false);
      return;
    }

    const vaciarResultado = await apiService.vaciarCarrito(idCliente);
    if (vaciarResultado.error) {
      setError(`Compra exitosa, pero hubo un error al limpiar el carrito en la Base de Datos.`);
    }

    setCarrito([]);
    setMensaje(`¡Compra Procesada con Éxito! Pedido #${idPedidoGenerado} registrado y pagado.`);
    setCargando(false);
  };

  const calcularTotalPrecio = () => {
    return carrito.reduce((acc, item) => acc + (Number(item.precio || 0) * Number(item.cantidad || 0)), 0).toFixed(2);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-primary">Tienda Online</h2>
          <p className="text-muted m-0">Bienvenido, <strong>{usuario}</strong> (ID: {idCliente})</p>
        </div>
        <button className="btn btn-outline-danger px-4" onClick={onLogout}>Cerrar Sesión</button>
      </div>

      {error && <div className="alert alert-danger shadow-sm">{error}</div>}
      {mensaje && <div className="alert alert-success shadow-sm">{mensaje}</div>}

      <div className="mb-5">
        <h4 className="fw-semibold mb-3"> Catálogo de Productos</h4>
        <div 
          className="d-flex pb-3" 
          style={{ 
            overflowX: 'auto', 
            whiteSpace: 'nowrap', 
            scrollBehavior: 'smooth', 
            WebkitOverflowScrolling: 'touch' 
          }}
        >
          {productos.length === 0 ? (
            <p className="text-muted ps-2">No hay productos en inventario.</p>
          ) : (
            productos.map((producto) => (
              <ProductoTarjeta 
                key={producto.id_producto} 
                producto={producto} 
                onAgregar={handleAgregarAlCarrito} 
              />
            ))
          )}
        </div>
        <small className="text-muted d-block mt-1"> Usa la rueda del mouse o desliza para ver más productos a la derecha.</small>
      </div>

      <hr className="my-5" />

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-sm p-4">
            <h4 className="fw-semibold mb-4 text-start">
              <span> Tu Carrito de Compras</span>
            </h4>

            {carrito.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted m-0">El carrito está vacío. Agrega productos desde el catálogo de arriba.</p>
              </div>
            ) : (
              <>
                <div className="list-group list-group-flush mb-4">
                  {carrito.map((item) => (
                    <div key={item.id_producto} className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                      <div>
                        <h6 className="mb-1 fw-bold">{item.nombre}</h6>
                        <small className="text-muted">Precio unitario: ${Number(item.precio || 0).toFixed(2)}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="text-end me-3">
                          <span className="fw-semibold d-block">
                            ${(Number(item.precio || 0) * Number(item.cantidad || 0)).toFixed(2)}
                          </span>
                          <span className="badge bg-light text-dark border mt-1">
                            Cantidad: {Number(item.cantidad || 0)}
                          </span>
                        </div>
                        <button 
                          className="btn btn-sm btn-outline-danger shadow-sm" 
                          title="Eliminar artículo"
                          onClick={() => handleEliminarDelCarrito(item.id_producto, item.nombre)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <h5 className="m-0 fw-bold">Total Estimado:</h5>
                  <h4 className="m-0 fw-bold text-success">${calcularTotalPrecio()}</h4>
                </div>
                
                <button 
                  className="btn btn-success w-100 mt-4 py-2 fw-bold shadow-sm"
                  onClick={handleProcesarCompra}
                  disabled={cargando}
                >
                  {cargando ? ' Procesando tu Compra...' : 'Proceder al Pago'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}