import { useState, useEffect } from 'react';
import { Container, Title, Paper, Button, Group, TextInput, Table, Text, Loader, Alert, Box } from '@mantine/core';
import axios from 'axios';
import { 
  IconPlus, 
  IconSearch, 
  IconAlertCircle, 
  IconArrowsSort,
  IconSortAscending2,
  IconSortDescending2 
} from '@tabler/icons-react';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://127.0.0.1:5000/api/productos');
        if (response.data) {
          setProductos(response.data);
        }
      } catch (error) {
        setError(error.message || 'Error al cargar los productos');
        console.error('Error fetching productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredProductos = productos.filter(producto =>
    Object.values(producto).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedProductos = [...filteredProductos].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'boolean') {
      return sortDirection === 'asc' 
        ? aValue === bValue ? 0 : aValue ? -1 : 1
        : aValue === bValue ? 0 : aValue ? 1 : -1;
    }

    return sortDirection === 'asc'
      ? aValue.toString().localeCompare(bValue.toString())
      : bValue.toString().localeCompare(aValue.toString());
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <IconArrowsSort size={14} style={{ marginLeft: 5 }} />;
    return sortDirection === 'asc' 
      ? <IconSortAscending2 size={14} style={{ marginLeft: 5 }} />
      : <IconSortDescending2 size={14} style={{ marginLeft: 5 }} />;
  };

  const TableHeader = ({ field, children }) => (
    <Table.Th 
      style={{ 
        padding: '12px 16px',
        cursor: 'pointer',
        userSelect: 'none'
      }}
      onClick={() => handleSort(field)}
    >
      <Group gap={4}>
        {children}
        <SortIcon field={field} />
      </Group>
    </Table.Th>
  );

  const rows = sortedProductos.map((producto) => (
    <Table.Tr key={producto.id}>
      <Table.Td>{producto.id}</Table.Td>
      <Table.Td>{producto.tipo}</Table.Td>
      <Table.Td>{producto.marca}</Table.Td>
      <Table.Td>{producto.modelo}</Table.Td>
      <Table.Td>{producto.descripcion}</Table.Td>
      <Table.Td>{producto.inventariable ? 'Sí' : 'No'}</Table.Td>
      <Table.Td>{producto.activo ? 'Sí' : 'No'}</Table.Td>
      <Table.Td>{new Date(producto.fecha_creacion).toLocaleDateString()}</Table.Td>
    </Table.Tr>
  ));

  const scrollbarStyles = {
    overflow: 'auto',
    flexGrow: 1,
    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--mantine-color-gray-4) var(--mantine-color-gray-1)',
    msOverflowStyle: '-ms-autohiding-scrollbar',
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1} style={{ color: '#323130' }}>
          Productos
        </Title>
        <Button leftSection={<IconPlus size={14} />}>
          Nuevo Producto
        </Button>
      </Group>

      {error ? (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Error" 
          color="red"
          mb="md"
        >
          {error}
        </Alert>
      ) : null}

      <TextInput
        placeholder="Buscar productos..."
        mb="md"
        leftSection={<IconSearch size={16} />}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
      />
      
      <Paper 
        shadow="sm" 
        p="md" 
        radius="md" 
        style={{ 
          height: '400px', // Reduced from 500px
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box style={scrollbarStyles}>
          <style>
            {`
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
                height: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: var(--mantine-color-gray-4);
                border-radius: var(--mantine-radius-sm);
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background-color: var(--mantine-color-gray-1);
              }
            `}
          </style>
          <Box 
            className="custom-scrollbar" 
            style={{ 
              overflow: 'auto',
              height: '100%', // Added to contain the table
              width: '100%'   // Added to ensure proper width
            }}
          >
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead 
                style={{ 
                  position: 'sticky', 
                  top: 0, 
                  backgroundColor: 'white', 
                  zIndex: 1,
                  borderBottom: '1px solid #e9ecef',
                  margin: 0,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                <Table.Tr>
                  <TableHeader field="id">ID</TableHeader>
                  <TableHeader field="tipo">Tipo</TableHeader>
                  <TableHeader field="marca">Marca</TableHeader>
                  <TableHeader field="modelo">Modelo</TableHeader>
                  <TableHeader field="descripcion">Descripción</TableHeader>
                  <TableHeader field="inventariable">Inventariable</TableHeader>
                  <TableHeader field="activo">Activo</TableHeader>
                  <TableHeader field="fecha_creacion">Fecha Creación</TableHeader>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
                      <Group justify="center" py="xl">
                        <Loader size="md" />
                        <Text>Cargando productos...</Text>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ) : rows.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
                      <Text ta="center" py="xl" c="dimmed">
                        No se encontraron productos
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : rows}
              </Table.Tbody>
            </Table>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Productos;