import { useState } from 'react';
import Navbar from './components/Navbar';
import POS from './pages/POS';
import Inventario from './pages/Inventario';
import Clientes from './pages/Clientes';
import Ventas from './pages/Ventas';

function App() {
  const [vistaActual, setVistaActual] = useState('pos');

  return (
    <div>
      <Navbar vistaActual={vistaActual} setVistaActual={setVistaActual} />
      {vistaActual === 'pos' && <POS />}
      {vistaActual === 'inventario' && <Inventario />}
      {vistaActual === 'clientes' && <Clientes />}
      {vistaActual === 'ventas' && <Ventas />}
    </div>
  );
}

export default App;