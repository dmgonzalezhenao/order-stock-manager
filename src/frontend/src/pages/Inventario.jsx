import { useEffect, useState } from 'react';
import api from '../api/axios';
import { AlertTriangle, PlusCircle, RefreshCw, Package, Search } from 'lucide-react';

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    stockMinimo: '',
  });

  const [stockEdicion, setStockEdicion] = useState({});

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

  // Filtrado de la lista general por nombre
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleCrearProducto = async (e) => {
    e.preventDefault();
    if (!nuevoProducto.nombre || nuevoProducto.precio <= 0) {
      alert('Por favor, ingresa datos válidos.');
      return;
    }

    try {
      await api.post('/Productos', {
        nombre: nuevoProducto.nombre,
        precio: parseFloat(nuevoProducto.precio),
        stock: parseInt(nuevoProducto.stock) || 0,
        stockMinimo: parseInt(nuevoProducto.stockMinimo) || 5,
      });

      setNuevoProducto({ nombre: '', precio: '', stock: '', stockMinimo: '' });
      cargarDatos();
      alert('¡Producto registrado con éxito!');
    } catch (error) {
      console.error('Error al crear el producto:', error);
      alert('Ocurrió un error al guardar el producto.');
    }
  };

  const handleActualizarStock = async (id) => {
    const nuevoStockVal = stockEdicion[id];
    if (nuevoStockVal === undefined || nuevoStockVal < 0) {
      alert('Ingresa una cantidad de stock válida.');
      return;
    }

    try {
      await api.patch(`/Productos/${id}/stock`, parseInt(nuevoStockVal));
      cargarDatos();
      alert('Stock actualizado exitosamente.');
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      alert('Error al actualizar el stock del producto.');
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Cargando datos de inventario...</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1><Package style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Gestión de Inventario</h1>

      {alertas.length > 0 && (
        <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>
          <h3><AlertTriangle style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Alertas de Reabastecimiento ({alertas.length})</h3>
          <p>Los siguientes productos han alcanzado o superado su límite mínimo de stock:</p>
          <ul>
            {alertas.map((prod) => (
              <li key={prod.id}>
                <strong>{prod.nombre}</strong> — Quedan <strong>{prod.stock}</strong> unidades (Mínimo: {prod.stockMinimo})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* FORMULARIO DE NUEVO PRODUCTO */}
        <div style={{ flex: 1, backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ddd', height: 'fit-content' }}>
          <h3><PlusCircle style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Nuevo Producto</h3>
          <form onSubmit={handleCrearProducto} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Nombre:</label>
              <input
                type="text"
                value={nuevoProducto.nombre}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Precio ($):</label>
              <input
                type="number"
                step="0.01"
                value={nuevoProducto.precio}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Stock Inicial:</label>
              <input
                type="number"
                value={nuevoProducto.stock}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Stock Mínimo (Alerta):</label>
              <input
                type="number"
                value={nuevoProducto.stockMinimo}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, stockMinimo: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              style={{ padding: '0.75rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Guardar Producto
            </button>
          </form>
        </div>

        {/* TABLA DE PRODUCTOS CON BARRA DE BÚSQUEDA */}
        <div style={{ flex: 2 }}>
          <h3>Catálogo General y Reabastecimiento</h3>

          {/* BARRA DE BÚSQUEDA */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input
              type="text"
              placeholder="Buscar por nombre de producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '0.9rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ padding: '0.5rem' }}>ID</th>
                <th style={{ padding: '0.5rem' }}>Producto</th>
                <th style={{ padding: '0.5rem' }}>Precio</th>
                <th style={{ padding: '0.5rem' }}>Stock Actual</th>
                <th style={{ padding: '0.5rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                    No hay productos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((prod) => (
                  <tr key={prod.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.5rem' }}>{prod.id}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <strong>{prod.nombre}</strong>
                      {prod.stock <= prod.stockMinimo && (
                        <span style={{ color: '#d9534f', fontSize: '0.8rem', marginLeft: '8px', fontWeight: 'bold' }}>
                          (Bajo Stock)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.5rem' }}>${prod.precio.toFixed(2)}</td>
                    <td style={{ padding: '0.5rem' }}>{prod.stock}</td>
                    <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="number"
                        placeholder="Nuevo stock"
                        value={stockEdicion[prod.id] ?? ''}
                        onChange={(e) =>
                          setStockEdicion({ ...stockEdicion, [prod.id]: e.target.value })
                        }
                        style={{ width: '90px', padding: '0.25rem' }}
                      />
                      <button
                        onClick={() => handleActualizarStock(prod.id)}
                        style={{ padding: '0.25rem 0.5rem', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <RefreshCw size={14} style={{ verticalAlign: 'middle' }} /> Actualizar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}