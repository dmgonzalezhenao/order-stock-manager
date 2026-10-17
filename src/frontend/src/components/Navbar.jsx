export default function Navbar({ vistaActual, setVistaActual }) {
  return (
    <nav style={{ backgroundColor: '#343a40', color: '#fff', padding: '1rem 2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Order Stock Manager</h2>
      <button
        onClick={() => setVistaActual('pos')}
        style={{
          backgroundColor: vistaActual === 'pos' ? '#007bff' : 'transparent',
          color: '#fff',
          border: '1px solid #007bff',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Punto de Venta (POS)
      </button>
      <button
        onClick={() => setVistaActual('inventario')}
        style={{
          backgroundColor: vistaActual === 'inventario' ? '#007bff' : 'transparent',
          color: '#fff',
          border: '1px solid #007bff',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Gestión de Inventario
      </button>
    </nav>
  );
}