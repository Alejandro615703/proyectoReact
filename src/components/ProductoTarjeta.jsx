import React from 'react';

export default function ProductoTarjeta({ producto, onAgregar }) {
  return (
    <div 
      className="card shadow-sm me-3 flex-shrink-0" 
      style={{ width: '260px', display: 'inline-block', whiteSpace: 'normal' }}
    >
      <div className="card-body d-flex flex-column justify-content-between" style={{ height: '220px' }}>
        <div>
          <h5 className="card-title fw-bold text-truncate" title={producto.nombre}>
            {producto.nombre}
          </h5>
          <p className="card-text text-muted small mb-2" style={{ height: '60px', overflow: 'hidden' }}>
            {producto.descripcion}
          </p>
        </div>
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold text-success fs-5">${producto.precio.toFixed(2)}</span>
            <span className="badge bg-secondary">Stock: {producto.stock}</span>
          </div>
          <button 
            className="btn btn-primary btn-sm w-100 fw-semibold"
            onClick={() => onAgregar(producto)}
            disabled={producto.stock <= 0}
          >
            {producto.stock > 0 ? ' Agregar al carrito' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  );
}