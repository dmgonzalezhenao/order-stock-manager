import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, UserPlus, Search, Edit3, X } from 'lucide-react';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // Estado para nuevo cliente
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', email: '' });

  // Estados para modal de edición
  const [clienteEditar, setClienteEditar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Clientes');
      setClientes(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setLoading(false);
    }
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 1. Crear cliente
  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nuevoCliente.nombre.trim()) return;

    try {
      await api.post('/Clientes', nuevoCliente);
      setNuevoCliente({ nombre: '', email: '' });
      cargarClientes();
      alert('Cliente creado exitosamente.');
    } catch (error) {
      console.error('Error al crear cliente:', error);
      alert(error.response?.data?.mensaje || 'Error al guardar cliente.');
    }
  };

  // 2. Abrir modal con datos del cliente
  const abrirEdicion = (cliente) => {
    setClienteEditar({ id: cliente.id, nombre: cliente.nombre, email: cliente.email });
    setMostrarModal(true);
  };

  // 3. Guardar cambios en API (PUT)
  const handleActualizar = async (e) => {
    e.preventDefault();
    if (!clienteEditar.nombre.trim()) return;

    try {
      await api.put(`/Clientes/${clienteEditar.id}`, {
        nombre: clienteEditar.nombre,
        email: clienteEditar.email,
      });
      setMostrarModal(false);
      setClienteEditar(null);
      cargarClientes();
      alert('Cliente actualizado exitosamente.');
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      alert(error.response?.data?.mensaje || 'Error al actualizar cliente.');
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Cargando clientes...</p>;

  return (
    <div
      style={{
        padding: '1.5rem',
        maxWidth: '1400px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h1 style={{ color: '#1a202c', marginTop: 0 }}>
        <Users style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Administración de Clientes
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* FORMULARIO DE REGISTRO */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            height: 'fit-content',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#2d3748' }}>
            <UserPlus size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Nuevo Cliente
          </h3>
          <form onSubmit={handleCrear} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#4a5568' }}>
                Nombre Completo *
              </label>
              <input
                type="text"
                value={nuevoCliente.nombre}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                required
                placeholder="Ej. Carlos Mendoza"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e0',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#4a5568' }}>
                Correo Electrónico
              </label>
              <input
                type="email"
                value={nuevoCliente.email}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                placeholder="carlos@ejemplo.com"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e0',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '0.65rem',
                backgroundColor: '#38a169',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Guardar Cliente
            </button>
          </form>
        </div>

        {/* TABLA DE CLIENTES CON BÚSQUEDA */}
        <div>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.65rem 0.65rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e0',
                backgroundColor: '#f7fafc',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: '#edf2f7', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>ID</th>
                <th style={{ padding: '0.75rem' }}>Nombre</th>
                <th style={{ padding: '0.75rem' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: '#718096' }}>
                    No se encontraron clientes.
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '0.75rem' }}>{c.id}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <strong>{c.nombre}</strong>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#4a5568' }}>{c.email || '—'}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button
                        onClick={() => abrirEdicion(c)}
                        style={{
                          backgroundColor: '#3182ce',
                          color: '#fff',
                          border: 'none',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Edit3 size={14} /> Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      {mostrarModal && clienteEditar && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '1.5rem',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '400px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#2d3748' }}>Editar Cliente #{clienteEditar.id}</h3>
              <button onClick={() => setMostrarModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleActualizar} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#4a5568' }}>Nombre *</label>
                <input
                  type="text"
                  value={clienteEditar.nombre}
                  onChange={(e) => setClienteEditar({ ...clienteEditar, nombre: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#4a5568' }}>Email</label>
                <input
                  type="email"
                  value={clienteEditar.email}
                  onChange={(e) => setClienteEditar({ ...clienteEditar, email: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  style={{ flex: 1, padding: '0.5rem', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '0.5rem', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}