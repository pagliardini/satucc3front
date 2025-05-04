import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Paper, 
  Button, 
  Group, 
  TextInput, 
  Table, 
  Text, 
  Loader, 
  Alert, 
  Box,
  Modal,
  Select,
  Switch,
  Textarea,
  Combobox,
  useCombobox
} from '@mantine/core';
import axios from 'axios';
import { 
  IconPlus, 
  IconSearch, 
  IconAlertCircle, 
  IconArrowsSort,
  IconSortAscending2,
  IconSortDescending2 
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [newProduct, setNewProduct] = useState({
    tipo_id: '',
    marca_id: '',
    modelo_id: '',
    descripcion: '',
    inventariable: false,
    activo: true
  });
  const [formError, setFormError] = useState(null);
  const [tipoValue, setTipoValue] = useState('');
  const [marcaValue, setMarcaValue] = useState('');
  const [modeloValue, setModeloValue] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const tipoCombobox = useCombobox();
  const marcaCombobox = useCombobox();
  const modeloCombobox = useCombobox();

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

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiposRes, marcasRes, modelosRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/tipos'),
          axios.get('http://127.0.0.1:5000/api/marcas'),
          axios.get('http://127.0.0.1:5000/api/modelos')
        ]);
        setTipos(tiposRes.data);
        setMarcas(marcasRes.data);
        setModelos(modelosRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSubmit = async () => {
    try {
      setFormError(null);
      setFormSuccess(false);

      // Validaciones antes de enviar
      if (!newProduct.tipo_id || !newProduct.marca_id || !newProduct.modelo_id) {
        setFormError('Todos los campos marcados con * son requeridos');
        return;
      }

      const response = await axios.post('http://127.0.0.1:5000/api/productos/add_producto', newProduct);
      
      // Check both status and data.success
      if (response.status === 201) {
        setFormSuccess(true);
        setFormError(null); // Ensure error is cleared
        await fetchProductos();
        
        setTimeout(() => {
          setModalOpen(false);
          setFormSuccess(false);
          // Reset form values
          setNewProduct({
            tipo_id: '',
            marca_id: '',
            modelo_id: '',
            descripcion: '',
            inventariable: false,
            activo: true
          });
          setTipoValue('');
          setMarcaValue('');
          setModeloValue('');
        }, 1500);
      } else {
        // Handle unexpected success response
        setFormError('Error inesperado al crear el producto');
        setFormSuccess(false);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setFormSuccess(false);
      setFormError(
        Array.isArray(error.response?.data?.errors) 
          ? error.response.data.errors.join(', ') 
          : 'Error al crear el producto'
      );
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

  const getFilteredTipos = () => {
    const shouldFilter = !tipos.some(tipo => tipo.nombre === tipoValue);
    return shouldFilter
      ? tipos.filter(tipo => tipo.nombre.toLowerCase().includes(tipoValue.toLowerCase().trim()))
      : tipos;
  };

  const getFilteredMarcas = () => {
    const shouldFilter = !marcas.some(marca => marca.nombre === marcaValue);
    return shouldFilter
      ? marcas.filter(marca => marca.nombre.toLowerCase().includes(marcaValue.toLowerCase().trim()))
      : marcas;
  };

  const getFilteredModelos = () => {
    const shouldFilter = !modelos.some(modelo => modelo.nombre === modeloValue);
    return shouldFilter
      ? modelos.filter(modelo => modelo.nombre.toLowerCase().includes(modeloValue.toLowerCase().trim()))
      : modelos;
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1} style={{ color: '#323130' }}>
          Productos
        </Title>
        <Button 
          leftSection={<IconPlus size={14} />}
          onClick={() => setModalOpen(true)}
        >
          Nuevo Producto
        </Button>
      </Group>

      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setFormError(null);
          setFormSuccess(false);
          // Reset values
          setNewProduct({
            tipo_id: '',
            marca_id: '',
            modelo_id: '',
            descripcion: '',
            inventariable: false,
            activo: true
          });
          setTipoValue('');
          setMarcaValue('');
          setModeloValue('');
        }}
        title="Nuevo Producto"
        size="lg"
      >
        {formError ? (
          <Alert 
            color="red" 
            title="Error" 
            mb="md"
            icon={<IconAlertCircle size={16} />}
          >
            {formError}
          </Alert>
        ) : formSuccess ? (
          <Alert 
            color="green" 
            title="Éxito" 
            mb="md"
            icon={<IconCheck size={16} />}
          >
            Producto creado correctamente
          </Alert>
        ) : null}

        <Combobox
          onOptionSubmit={(optionValue) => {
            const tipo = tipos.find(t => t.nombre === optionValue);
            if (tipo) {
              setNewProduct({ ...newProduct, tipo_id: tipo.id.toString() });
              setTipoValue(tipo.nombre);
            }
            tipoCombobox.closeDropdown();
          }}
          store={tipoCombobox}
        >
          <Combobox.Target>
            <TextInput
              label="Tipo"
              placeholder="Seleccione o escriba un tipo"
              required
              value={tipoValue}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setTipoValue(value);
                tipoCombobox.openDropdown();
                tipoCombobox.updateSelectedOptionIndex();
              }}
              onClick={() => tipoCombobox.openDropdown()}
              onFocus={() => tipoCombobox.openDropdown()}
              onBlur={() => tipoCombobox.closeDropdown()}
            />
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>
              {getFilteredTipos().length === 0 ? (
                <Combobox.Empty>No se encontraron tipos</Combobox.Empty>
              ) : (
                getFilteredTipos().map((tipo) => (
                  <Combobox.Option value={tipo.nombre} key={tipo.id}>
                    {tipo.nombre}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

        <Combobox
          onOptionSubmit={(optionValue) => {
            const marca = marcas.find(m => m.nombre === optionValue);
            if (marca) {
              setNewProduct({ ...newProduct, marca_id: marca.id.toString() });
              setMarcaValue(marca.nombre);
            }
            marcaCombobox.closeDropdown();
          }}
          store={marcaCombobox}
        >
          <Combobox.Target>
            <TextInput
              label="Marca"
              placeholder="Seleccione o escriba una marca"
              required
              value={marcaValue}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setMarcaValue(value);
                marcaCombobox.openDropdown();
                marcaCombobox.updateSelectedOptionIndex();
              }}
              onClick={() => marcaCombobox.openDropdown()}
              onFocus={() => marcaCombobox.openDropdown()}
              onBlur={() => marcaCombobox.closeDropdown()}
            />
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>
              {getFilteredMarcas().length === 0 ? (
                <Combobox.Empty>No se encontraron marcas</Combobox.Empty>
              ) : (
                getFilteredMarcas().map((marca) => (
                  <Combobox.Option value={marca.nombre} key={marca.id}>
                    {marca.nombre}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

        <Combobox
          onOptionSubmit={(optionValue) => {
            const modelo = modelos.find(m => m.nombre === optionValue);
            if (modelo) {
              setNewProduct({ ...newProduct, modelo_id: modelo.id.toString() });
              setModeloValue(modelo.nombre);
            }
            modeloCombobox.closeDropdown();
          }}
          store={modeloCombobox}
        >
          <Combobox.Target>
            <TextInput
              label="Modelo"
              placeholder="Seleccione o escriba un modelo"
              required
              value={modeloValue}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setModeloValue(value);
                modeloCombobox.openDropdown();
                modeloCombobox.updateSelectedOptionIndex();
              }}
              onClick={() => modeloCombobox.openDropdown()}
              onFocus={() => modeloCombobox.openDropdown()}
              onBlur={() => modeloCombobox.closeDropdown()}
            />
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>
              {getFilteredModelos().length === 0 ? (
                <Combobox.Empty>No se encontraron modelos</Combobox.Empty>
              ) : (
                getFilteredModelos().map((modelo) => (
                  <Combobox.Option value={modelo.nombre} key={modelo.id}>
                    {modelo.nombre}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

        <Textarea
          label="Descripción"
          placeholder="Ingrese una descripción"
          value={newProduct.descripcion}
          onChange={(event) => setNewProduct({...newProduct, descripcion: event.currentTarget.value})}
          mb="md"
        />

        <Switch
          label="Inventariable"
          checked={newProduct.inventariable}
          onChange={(event) => setNewProduct({...newProduct, inventariable: event.currentTarget.checked})}
          mb="md"
        />

        <Switch
          label="Activo"
          checked={newProduct.activo}
          onChange={(event) => setNewProduct({...newProduct, activo: event.currentTarget.checked})}
          mb="xl"
        />

        <Group justify="flex-end">
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Guardar
          </Button>
        </Group>
      </Modal>

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