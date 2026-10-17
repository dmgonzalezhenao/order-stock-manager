export default function Navbar({ vistaActual, setVistaActual }) {
  // Función auxiliar para mantener estilos consistentes en todos los botones
  const getEstiloBoton = (vista) => ({
    backgroundColor: vistaActual === vista ? '#3182ce' : 'transparent',
    color: '#fff',
    border: '1px solid #3182ce',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: vistaActual === vista ? 'bold' : 'normal',
    transition: 'all 0.2s ease',
  });

  return (
    <nav
      style={{
        backgroundColor: '#1a202c',
        color: '#fff',
        padding: '1rem 2rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ margin: '0 1rem 0 0', fontSize: '1.25rem', fontWeight: 'bold' }}>
        FullStack POS
      </h2>

      <button onClick={() => setVistaActual('pos')} style={getEstiloBoton('pos')}>
        Punto de Venta (POS)
      </button>

      <button onClick={() => setVistaActual('inventario')} style={getEstiloBoton('inventario')}>
        Inventario
      </button>

      <button onClick={() => setVistaActual('clientes')} style={getEstiloBoton('clientes')}>
        Clientes
      </button>

      <button onClick={() => setVistaActual('ventas')} style={getEstiloBoton('ventas')}>
        Historial Ventas
      </button>
    </nav>
  );
}