import React, { useState } from 'react';
import { apiService } from '../services/api';

export default function Login({ onLoginExitoso }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (esRegistro) {
      const resultado = await apiService.registrarCliente({
        nombre, correo_electronico: correo, contrasena, telefono, direccion
      });
      if (resultado.error) {
        setError(resultado.error);
      } else {
        setMensaje('¡Usuario registrado con éxito! Ya puedes iniciar sesión.');
        setEsRegistro(false);
      }
    } else {
      const resultado = await apiService.loginCliente(correo, contrasena);
      if (resultado.error) {
        setError(resultado.error);
      } else {
        onLoginExitoso(resultado.nombre, resultado.id_cliente);
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '400px' }}>
        <h3 className="text-center fw-bold text-primary mb-4">
          {esRegistro ? 'Registrarse' : 'Iniciar Sesión'}
        </h3>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {mensaje && <div className="alert alert-success py-2 small">{mensaje}</div>}

        <form onSubmit={handleSubmit}>
          {esRegistro && (
            <div className="mb-3">
              <label className="form-label small fw-semibold">Nombre Completo</label>
              <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Correo Electrónico</label>
            <input type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Contraseña</label>
            <input type="password" className="form-control" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
          </div>
          {esRegistro && (
            <>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Teléfono</label>
                <input type="text" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-semibold">Dirección de Envío</label>
                <input type="text" className="form-control" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mb-3 shadow-sm">
            {esRegistro ? 'Crear Cuenta' : 'Ingresar'}
          </button>
        </form>

        <div className="text-center">
          <button className="btn btn-link btn-sm text-decoration-none" onClick={() => { setEsRegistro(!esRegistro); setError(''); setMensaje(''); }}>
            {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}