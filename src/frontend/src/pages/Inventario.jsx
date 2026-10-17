import { useEffect, useState } from 'react';
import api from '../api/axios';
import { AlertTriangle, PlusCircle, RefreshCw, Package, Search, Edit3, X } from 'lucide-react';

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // Formulario nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    stockMinimo: '',
  });

  // Reabastecimiento rápido
  const [stockEdicion, setStockEdicion] = useState({});

  // Modal de edición completa
  const [productoEditar, setProductoEditar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resProductos, resAlertas] = await Promise.all([
        api.get('/Productos'),
        api.get('/Productos/alertas/bajo-stock'),
      ]);
      setProductos(resProductos.data);
      setAlertas(resAlertas.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos del inventario:', error);
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleCrearProducto = async (e) => {
    e.preventDefault();
    if (!nuevoProducto.nombre || nuevoProducto.precio <= 0) return;

    try {
      await api.post('/Productos', {
        nombre: nuevoProducto.nombre,
        precio: parseFloat(nuevoProducto.precio),
        stock: parseInt(nuevoProducto.stock) || 0,
        stockMinimo: parseInt(nuevoProducto.stockMinimo) || 5,
      });

      setNuevoProducto({ nombre: '', precio: '', stock: '', stockMinimo: '' });
      cargarDatos();
      alert('Producto registrado exitosamente.');
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert(error.response?.data?.mensaje || 'Error al guardar el producto.');
    }
  };

  const handleActualizarStockRapido = async (id) => {
    const nuevoStockVal = stockEdicion[id];
    if (nuevoStockVal === undefined || nuevoStockVal < 0) return;

    try {
      await api.patch(`/Productos/${id}/stock`, parseInt(nuevoStockVal));
      cargarDatos();
      alert('Stock actualizado.');
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      alert('Error al actualizar stock.');
    }
  };

  const abrirEdicion = (prod) => {
    setProductoEditar({ ...prod });
    setMostrarModal(true);
  };

  const handleActualizarProductoCompleto = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/Productos/${productoEditar.id}`, {
        nombre: productoEditar.nombre,
        precio: parseFloat(productoEditar.precio),
        stock: parseInt(productoEditar.stock),
        stockMinimo: parseInt(productoEditar.stockMinimo),
      });

      setMostrarModal(false);
      setProductoEditar(null);
      cargarDatos();
      alert('Producto actualizado exitosamente.');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert(error.response?.data?.mensaje || 'Error al actualizar el producto.');
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Cargando inventario...</p>;

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ color: '#1a202c', marginTop: 0 }}>
        <Package style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Gestión de Inventario
      </h1>

      {alertas.length > 0 && (
        <div style={{ backgroundColor: '#fffaf0', border: '1px solid #feebc8', color: '#744210', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>
            <AlertTriangle style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Alertas de Reabastecimiento ({alertas.length})
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {alertas.map((prod) => (
              <li key={prod.id}>
                <strong>{prod.nombre}</strong> — Stock actual: <strong>{prod.stock}</strong> (Mínimo requerido: {prod.stockMinimo})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* FORMULARIO DE NUEVO PRODUCTO */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, color: '#2d3748' }}>
            <PlusCircle size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Nuevo Producto
          </h3>
          <form onSubmit={handleCrearProducto} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#4a5568' }}>Nombre *</label>
              <input
                type="text"
                value={nuevoProducto.nombre}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#4a5568' }}>Precio ($) *</label>
              <input
                type="number"
                step="0.01"
                value={nuevoProducto.precio}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#4a5568' }}>Stock Inicial *</label>
              <input
                type="number"
                value={nuevoProducto.stock}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#4a5568' }}>Stock Mínimo (Alerta) *</label>
              <input
                type="number"
                value={nuevoProducto.stockMinimo}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, stockMinimo: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              style={{ padding: '0.65rem', backgroundColor: '#38a169', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Guardar Producto
            </button>
          </form>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <div>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#718096' }} />
            <input
              type="text"
              placeholder="Buscar por nombre de producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e0', backgroundColor: '#f7fafc', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: '#edf2f7', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>ID</th>
                <th style={{ padding: '0.75rem' }}>Producto</th>
                <th style={{ padding: '0.75rem' }}>Precio</th>
                <th style={{ padding: '0.75rem' }}>Stock</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '0.75rem' }}>{prod.id}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <strong>{prod.nombre}</strong>
                    {prod.stock <= prod.stockMinimo && (
                      <span style={{ color: '#e53e3e', fontSize: '0.75rem', marginLeft: '6px', fontWeight: 'bold' }}>
                        (Bajo Stock)
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem' }}>${prod.precio.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem' }}>{prod.stock}</td>
                  <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={stockEdicion[prod.id] ?? ''}
                      onChange={(e) => setStockEdicion({ ...stockEdicion, [prod.id]: e.target.value })}
                      style={{ width: '70px', padding: '0.25rem', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                    />
                    <button
                      onClick={() => handleActualizarStockRapido(prod.id)}
                      title="Reabastecer stock rápido"
                      style={{ padding: '0.35rem 0.5rem', backgroundColor: '#319795', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <RefreshCw size={14} />
                    </button>
                    <button
                      onClick={() => abrirEdicion(prod)}
                      title="Editar todo el producto"
                      style={{ padding: '0.35rem 0.5rem', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Edit3 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE EDICIÓN COMPLETA */}
      {mostrarModal && productoEditar && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#2d3748' }}>Editar Producto #{productoEditar.id}</h3>
              <button onClick={() => setMostrarModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleActualizarProductoCompleto} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#4a5568' }}>Nombre *</label>
                <input
                  type="text"
                  value={productoEditar.nombre}
                  onChange={(e) => setProductoEditar({ ...productoEditar, nombre: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#4a5568' }}>Precio ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={productoEditar.precio}
                  onChange={(e) => setProductoEditar({ ...productoEditar, precio: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#4a5568' }}>Stock Actual *</label>
                <input
                  type="number"
                  value={productoEditar.stock}
                  onChange={(e) => setProductoEditar({ ...productoEditar, stock: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#4a5568' }}>Stock Mínimo (Alerta) *</label>
                <input
                  type="number"
                  value={productoEditar.stockMinimo}
                  onChange={(e) => setProductoEditar({ ...productoEditar, stockMinimo: e.target.value })}
                  required
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