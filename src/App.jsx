import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Productos from './pages/catalogos/Productos';
import Marcas from './pages/catalogos/Marcas';
import Lugares from './pages/catalogos/Lugares';
import Imputaciones from './pages/gestion/Imputaciones';
import Compras from './pages/gestion/Compras';
import Bajas from './pages/gestion/Bajas';
import Reasignar from './pages/gestion/Reasignar';
import Configuracion from './pages/Configuracion';

function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <BrowserRouter>
      <AppShell
        header={{ height: { base: 60, md: 70, lg: 80 } }}
        navbar={{
          width: { base: 200, md: 300, lg: 400 },
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        footer={{ height: 60 }}
        padding="md"
      >
        <Header opened={opened} toggle={toggle} />
        <Navbar />
        <AppShell.Main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/catalogos/productos" element={<Productos />} />
            <Route path="/catalogos/marcas" element={<Marcas />} />
            <Route path="/catalogos/lugares" element={<Lugares />} />
            <Route path="/gestion/imputaciones" element={<Imputaciones />} />
            <Route path="/gestion/compras" element={<Compras />} />
            <Route path="/gestion/bajas" element={<Bajas />} />
            <Route path="/gestion/reasignar" element={<Reasignar />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Routes>
        </AppShell.Main>
        <Footer />
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
