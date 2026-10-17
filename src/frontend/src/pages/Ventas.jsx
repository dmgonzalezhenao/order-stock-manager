import { useEffect, useState } from 'react';
import api from '../api/axios';
import { History, Search, ChevronLeft, ChevronRight, Calendar, DollarSign, User } from 'lucide-react';

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // Estados de Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina, setElementosPorPagina] = useState(5);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Pedidos');
      setVentas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      setLoading(false);
    }
  };

  // Filtrado de ventas por cliente o número de pedido
  const ventasFiltradas = ventas.filter(
    (v) =>
      v.nombreCliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.pedidoId.toString().includes(busqueda)
  );

  // Lógica de Paginación
  const totalPaginas = Math.ceil(ventasFiltradas.length / elementosPorPagina) || 1;
  const indiceUltimoItem = paginaActual * elementosPorPagina;
  const indicePrimerItem = indiceUltimoItem - elementosPorPagina;
  const ventasPaginadas = ventasFiltradas.slice(indicePrimerItem, indiceUltimoItem);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Cargando historial de ventas...</p>;

  // Componente reutilizable para los controles de paginación
  const ControlesPaginacion = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 0',
        color: '#4a5568',
        fontSize: '0.9rem',
      }}
    >
      <div>
        <span>Mostrando {ventasPaginadas.length} de {ventasFiltradas.length} transacciones</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          style={{
            padding: '0.4rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e0',
            backgroundColor: paginaActual === 1 ? '#edf2f7' : '#fff',
            cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronLeft size={16} /> Anterior
        </button>

        <span style={{ fontWeight: 'bold', padding: '0 0.5rem' }}>
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          style={{
            padding: '0.4rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e0',
            backgroundColor: paginaActual === totalPaginas ? '#edf2f7' : '#fff',
            cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Siguiente <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        padding: '1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h1 style={{ color: '#1a202c', marginTop: 0 }}>
        <History style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Historial de Transacciones
      </h1>

      {/* FILTROS Y BÚSQUEDA */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}
          />
          <input
            type="text"
            placeholder="Buscar por cliente o ID de factura..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1); // Reiniciar a página 1 al buscar
            }}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', color: '#4a5568' }}>Mostrar:</label>
          <select
            value={elementosPorPagina}
            onChange={(e) => {
              setElementosPorPagina(Number(e.target.value));
              setPaginaActual(1);
            }}
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e0',
              backgroundColor: '#fff',
            }}
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
          </select>
        </div>
      </div>

      {/* PAGINACIÓN SUPERIOR */}
      <ControlesPaginacion />

      {/* TABLA DE HISTORIAL */}
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#edf2f7', borderBottom: '2px solid #cbd5e0' }}>
              <th style={{ padding: '0.75rem' }}>Factura #</th>
              <th style={{ padding: '0.75rem' }}><User size={14} style={{ verticalAlign: 'middle' }} /> Cliente</th>
              <th style={{ padding: '0.75rem' }}><Calendar size={14} style={{ verticalAlign: 'middle' }} /> Fecha</th>
              <th style={{ padding: '0.75rem' }}>Cant. Ítems</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}><DollarSign size={14} style={{ verticalAlign: 'middle' }} /> Total Pagado</th>
            </tr>
          </thead>
          <tbody>
            {ventasPaginadas.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#718096' }}>
                  No hay registros de ventas que coincidan.
                </td>
              </tr>
            ) : (
              ventasPaginadas.map((v) => (
                <tr key={v.pedidoId} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#3182ce' }}>#{v.pedidoId}</td>
                  <td style={{ padding: '0.75rem', color: '#2d3748' }}>{v.nombreCliente}</td>
                  <td style={{ padding: '0.75rem', color: '#718096', fontSize: '0.9rem' }}>
                    {new Date(v.fecha).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.75rem' }}>{v.totalProductos} unidades</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#276749' }}>
                    ${v.total.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN INFERIOR */}
      <ControlesPaginacion />
    </div>
  );
}