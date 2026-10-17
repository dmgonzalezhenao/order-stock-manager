import { useState } from 'react';
import Navbar from './components/Navbar';
import POS from './pages/POS';
import Inventario from './pages/Inventario';

function App() {
  const [vistaActual, setVistaActual] = useState('pos');

  return (
    <div>
      <Navbar vistaActual={vistaActual} setVistaActual={setVistaActual} />
      {vistaActual === 'pos' ? <POS /> : <Inventario />}
    </div>
  );
}

export default App;