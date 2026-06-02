import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [sesion, setSesion] = useState({
    autenticado: false,
    usuarioNombre: '',
    idCliente: null
  });

  const handleLoginExitoso = (nombre, id) => {
    setSesion({
      autenticado: true,
      usuarioNombre: nombre,
      idCliente: id
    });
  };

  const handleLogout = () => {
    setSesion({
      autenticado: false,
      usuarioNombre: '',
      idCliente: null
    });
  };

  return (
    <div className="bg-light" style={{ minHeight: '100vh' }}>
      {sesion.autenticado ? (
        <Dashboard 
          usuario={sesion.usuarioNombre} 
          idCliente={sesion.idCliente} 
          onLogout={handleLogout} 
        />
      ) : (
        <Login onLoginExitoso={handleLoginExitoso} />
      )}
    </div>
  );
}