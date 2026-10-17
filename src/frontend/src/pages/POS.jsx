import { useEffect, useState } from 'react';
import api from '../api/axios';
import { ShoppingCart, Plus, Minus, CheckCircle, Package, Search, User } from 'lucide-react';

export default function POS() {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [factura, setFactura] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const resProductos = await api.get('/Productos');
      setProductos(resProductos.data);

      // Intentamos cargar clientes si el endpoint existe, sino usamos fallback
      try {
        const resClientes = await api.get('/Clientes');
        setClientes(resClientes.data);
      } catch {
        setClientes([{ id: 1, nombre: 'Consumidor Final' }]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos del POS:', error);
      setLoading(false);
    }
  };

  const cargarProductos = async () => {
    const res = await api.get('/Productos');
    setProductos(res.data);
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) {
      alert('Producto agotado');
      return;
    }

    setCarrito((prev) => {
      const existente = prev.find((item) => item.productoId === producto.id);
      if (existente) {
        if (existente.cantidad >= producto.stock) {
          alert(`No hay más stock disponible de ${producto.nombre}`);
          return prev;
        }
        return prev.map((item) =>
          item.productoId === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }

      return [
        ...prev,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
          stockMax: producto.stock,
        },
      ];
    });
  };

  const actualizarCantidad = (productoId, delta) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.productoId === productoId) {
            const nuevaCantidad = item.cantidad + delta;
            if (nuevaCantidad > item.stockMax) {
              alert('Cantidad supera el stock disponible');
              return item;
            }
            return { ...item, cantidad: nuevaCantidad };
          }
          return item;
        })
        .filter((item) => item.cantidad > 0)
    );
  };

  const totalFactura = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const procesarVenta = async () => {
    if (carrito.length === 0) return;

    const pedidoPayload = {
      clienteId: parseInt(clienteSeleccionado),
      detalles: carrito.map((item) => ({
        productoId: item.productoId,
        cantidad: item.cantidad,
      })),
    };

    try {
      const response = await api.post('/Pedidos', pedidoPayload);
      setFactura(response.data);
      setCarrito([]);
      cargarProductos();
      alert('¡Venta realizada con éxito!');
    } catch (error) {
      console.error('Error al procesar la venta:', error);
      alert(error.response?.data?.mensaje || 'Error al procesar la venta.');
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Cargando datos del POS...</p>;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        padding: '1.5rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* SECCIÓN IZQUIERDA: CATÁLOGO */}
      <div>
        <h2 style={{ color: '#1a202c', marginTop: 0 }}>
          <Package style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Catálogo de Productos
        </h2>

        {/* BARRA DE BÚSQUEDA MEJORADA */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}
          />
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.65rem 0.65rem 2.5rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e0',
              backgroundColor: '#f7fafc',
              color: '#2d3748',
              fontSize: '0.95rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* GRILLA DE PRODUCTOS RESPONSIVE */}
        {productosFiltrados.length === 0 ? (
          <p style={{ color: '#718096' }}>No se encontraron productos.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1rem',
            }}
          >
            {productosFiltrados.map((prod) => (
              <div
                key={prod.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: prod.stock === 0 ? '#fff5f5' : '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#2d3748' }}>{prod.nombre}</h3>
                  <p style={{ margin: '0.25rem 0', color: '#4a5568' }}>
                    Precio: <strong>${prod.precio.toFixed(2)}</strong>
                  </p>
                  <p style={{ margin: '0.25rem 0 1rem 0', fontSize: '0.85rem', color: prod.stock === 0 ? '#e53e3e' : '#718096' }}>
                    Stock: {prod.stock}
                  </p>
                </div>
                <button
                  onClick={() => agregarAlCarrito(prod)}
                  disabled={prod.stock <= 0}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: prod.stock <= 0 ? '#a0aec0' : '#319795',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: prod.stock <= 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {prod.stock <= 0 ? 'Agotado' : 'Agregar'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECCIÓN DERECHA: CARRITO DE VENTA */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          height: 'fit-content',
        }}
      >
        <h2 style={{ marginTop: 0, color: '#1a202c' }}>
          <ShoppingCart style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Carrito de Venta
        </h2>

        {/* SELECTOR DE CLIENTE */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.35rem', color: '#4a5568' }}>
            <User size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Cliente Asignado:
          </label>
          <select
            value={clienteSeleccionado}
            onChange={(e) => setClienteSeleccionado(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e0',
              backgroundColor: '#fff',
              color: '#2d3748',
            }}
          >
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {carrito.length === 0 ? (
          <p style={{ color: '#718096' }}>El carrito está vacío.</p>
        ) : (
          <div>
            {carrito.map((item) => (
              <div
                key={item.productoId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  borderBottom: '1px solid #edf2f7',
                  paddingBottom: '0.5rem',
                }}
              >
                <div>
                  <strong style={{ color: '#2d3748' }}>{item.nombre}</strong>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#718096' }}>
                    ${item.precio.toFixed(2)} x {item.cantidad} =${(item.precio * item.cantidad).toFixed(2)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  <button onClick={() => actualizarCantidad(item.productoId, -1)} style={{ padding: '2px 6px' }}><Minus size={12} /></button>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.cantidad}</span>
                  <button onClick={() => actualizarCantidad(item.productoId, 1)} style={{ padding: '2px 6px' }}><Plus size={12} /></button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Total: ${totalFactura.toFixed(2)}</h3>
              <button
                onClick={procesarVenta}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#3182ce',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Procesar Venta
              </button>
            </div>
          </div>
        )}

        {factura && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: '6px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#22543d' }}>
              <CheckCircle size={18} style={{ color: '#38a169', verticalAlign: 'middle', marginRight: '6px' }} /> Factura #{factura.pedidoId}
            </h3>
            <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#276749' }}><strong>Cliente:</strong> {factura.nombreCliente}</p>
            <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#276749' }}><strong>Total Pagado:</strong> ${factura.total.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}