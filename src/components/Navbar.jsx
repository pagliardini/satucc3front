import React, { useState } from 'react';
import { AppShell, Stack, Button, Collapse } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { 
  IconChevronDown, 
  IconChevronRight, 
  IconBox, 
  IconBuildingStore,
  IconTags,
  IconMapPin,
  IconClipboardList,
  IconShoppingCart,
  IconTrash,
  IconArrowsExchange
} from '@tabler/icons-react';

function Navbar() {
  const navigate = useNavigate();
  const [catalogosOpened, setCatalogosOpened] = useState(false);
  const [gestionOpened, setGestionOpened] = useState(false);

  const buttonStyle = {
    fontFamily: 'Segoe UI',
    fontSize: '14px',
    color: '#323130',
    justifyContent: 'flex-start'
  };

  const subItemStyle = {
    ...buttonStyle,
    fontSize: '13px',
    color: '#666666',
    backgroundColor: '#f3f2f1',
    borderLeft: '2px solid #0078D4',
    borderRadius: '0 4px 4px 0',
    marginLeft: '1rem',
    padding: '6px 12px',
    '&:hover': {
      backgroundColor: '#e5e5e5',
    }
  };

  return (
    <AppShell.Navbar p="md">
      <Stack>
        <Button 
          variant="subtle"
          onClick={() => navigate('/')}
          style={buttonStyle}
        >
          Dashboard
        </Button>

        <Button 
          variant="subtle"
          onClick={() => setCatalogosOpened(!catalogosOpened)}
          style={buttonStyle}
          rightSection={
            catalogosOpened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />
          }
        >
          Catálogos
        </Button>
        
        <Collapse in={catalogosOpened}>
          <Stack spacing="xs" pl="md">
            <Button
              variant="subtle"
              onClick={() => navigate('/catalogos/productos')}
              style={subItemStyle}
              size="sm"
              leftSection={<IconBox size={14} />}
            >
              Productos
            </Button>
            <Button
              variant="subtle"
              onClick={() => navigate('/catalogos/marcas')}
              style={subItemStyle}
              size="sm"
              leftSection={<IconBuildingStore size={14} />}
            >
              Marcas, Tipos y Modelos
            </Button>
            <Button
              variant="subtle"
              onClick={() => navigate('/catalogos/lugares')}
              style={subItemStyle}
              size="sm"
              leftSection={<IconMapPin size={14} />}
            >
              Lugares
            </Button>
          </Stack>
        </Collapse>

        <Button 
          variant="subtle"
          onClick={() => setGestionOpened(!gestionOpened)}
          style={buttonStyle}
          rightSection={
            gestionOpened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />
          }
        >
          Gestión
        </Button>

        <Collapse in={gestionOpened}>
          <Stack spacing="xs" pl="md">
            <Button
              variant="subtle"
              onClick={() => navigate('/gestion/imputaciones')}
              style={subItemStyle}
              size="sm"
              leftSection={<IconClipboardList size={14} />}
            >
              Imputaciones
            </Button>
            <Button
              variant="subtle"
              onClick={() => navigate('/gestion/compras')}
              style={subItemStyle}
              size="sm"
              leftSection={<IconShoppingCart size={14} />}
            >
              Compras
            </Button>
            <Button
              variant="subtle"
              onClick={() => navigate('/gestion/bajas')}
              style={subItemStyle}
              size="sm"
              leftSection={<IconTrash size={14} />}
            >
              Bajas
            </Button>
            <Button
              variant="subtle"
              onClick={() => navigate('/gestion/reasignar')}
              style={subItemStyle}
              size="sm"
              leftSection={<IconArrowsExchange size={14} />}
            >
              Reasignar
            </Button>
          </Stack>
        </Collapse>

        <Button 
          variant="subtle"
          onClick={() => navigate('/configuracion')}
          style={buttonStyle}
        >
          Configuración
        </Button>
      </Stack>
    </AppShell.Navbar>
  );
}

export default Navbar;