import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Tabs, 
  Paper, 
  Table,
  Button,
  Group,
  TextInput,
  Modal,
  Alert,
  Loader,
  Text,
  Select
} from '@mantine/core';
import { 
  IconPlus, 
  IconSearch, 
  IconCheck, 
  IconAlertCircle,
  IconArrowsSort,
  IconSortAscending2,
  IconSortDescending2,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';
import axios from 'axios';

function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [newItem, setNewItem] = useState({ nombre: '' });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('marcas');
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const fetchData = async (endpoint, setter) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://127.0.0.1:5000/api/${endpoint}`);
      if (response.data) {
        setter(response.data);
      }
    } catch (error) {
      console.error(`Error details for ${endpoint}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(
        error.response?.data?.message || 
        error.message || 
        `Error al cargar ${endpoint}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchData('marcas', setMarcas),
        fetchData('tipos', setTipos),
        fetchData('modelos', setModelos)
      ]);
    };
    loadData();
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

      if (!newItem.nombre.trim()) {
        setFormError('El nombre es requerido');
        return;
      }

      if (activeTab === 'modelos' && !selectedMarca) {
        setFormError('Debe seleccionar una marca para el modelo');
        return;
      }

      const payload = {
        nombre: newItem.nombre.trim(),
        ...(activeTab === 'modelos' && { marca_id: parseInt(selectedMarca) })
      };

      console.log(`Sending payload to ${activeTab}:`, payload);

      const response = await axios.post(`http://127.0.0.1:5000/api/${activeTab}`, payload);
      
      console.log(`Response from ${activeTab}:`, response);

      if (response.status === 201) {
        setFormSuccess(true);
        setFormError(null);
        
        // Refresh data
        await fetchData(activeTab, 
          activeTab === 'marcas' ? setMarcas : 
          activeTab === 'tipos' ? setTipos : 
          setModelos
        );
        
        setTimeout(() => {
          setModalOpen(false);
          setFormSuccess(false);
          setNewItem({ nombre: '' });
          setSelectedMarca(null);
        }, 1500);
      }
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        endpoint: activeTab,
        payload: newItem
      });

      setFormSuccess(false);
      setFormError(
        error.response?.data?.message || 
        error.message || 
        'Error al crear el elemento'
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/${activeTab}/${id}`);
      if (response.status === 200) {
        await fetchData(activeTab, 
          activeTab === 'marcas' ? setMarcas : 
          activeTab === 'tipos' ? setTipos : 
          setModelos
        );
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setError(error.response?.data?.message || 'Error al eliminar el elemento');
    }
  };

  const handleEdit = async () => {
    try {
      setFormError(null);
      setFormSuccess(false);

      if (!newItem.nombre.trim()) {
        setFormError('El nombre es requerido');
        return;
      }

      const payload = {
        nombre: newItem.nombre.trim(),
        ...(activeTab === 'modelos' && { marca_id: parseInt(selectedMarca) })
      };

      const response = await axios.put(
        `http://127.0.0.1:5000/api/${activeTab}/${editItem.id}`, 
        payload
      );
      
      if (response.status === 200) {
        setFormSuccess(true);
        setFormError(null);
        await fetchData(activeTab, 
          activeTab === 'marcas' ? setMarcas : 
          activeTab === 'tipos' ? setTipos : 
          setModelos
        );
        
        setTimeout(() => {
          setModalOpen(false);
          setFormSuccess(false);
          setNewItem({ nombre: '' });
          setSelectedMarca(null);
          setEditItem(null);
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      setFormSuccess(false);
      setFormError(error.response?.data?.message || 'Error al actualizar el elemento');
    }
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

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <IconArrowsSort size={14} style={{ marginLeft: 5 }} />;
    return sortDirection === 'asc' 
      ? <IconSortAscending2 size={14} style={{ marginLeft: 5 }} />
      : <IconSortDescending2 size={14} style={{ marginLeft: 5 }} />;
  };

  const ItemList = ({ items, sortField, sortDirection }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState('');

    const filteredItems = items.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(localSearchTerm.toLowerCase())
      )
    );

    const sortedItems = [...filteredItems].sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });

    return (
      <>
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Buscar..."
            leftSection={<IconSearch size={16} />}
            value={localSearchTerm}
            onChange={(event) => setLocalSearchTerm(event.currentTarget.value)}
            style={{ flexGrow: 1 }}
          />
          <Button 
            leftSection={<IconPlus size={14} />}
            onClick={() => setModalOpen(true)}
          >
            Nuevo
          </Button>
        </Group>

        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <TableHeader field="id">ID</TableHeader>
              <TableHeader field="nombre">Nombre</TableHeader>
              <Table.Th style={{ width: '120px' }}>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <Group justify="center" py="xl">
                    <Loader size="md" />
                    <Text>Cargando...</Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ) : sortedItems.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <Text ta="center" py="xl" c="dimmed">
                    No se encontraron registros
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              sortedItems.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.id}</Table.Td>
                  <Table.Td>{item.nombre}</Table.Td>
                  <Table.Td>
                    <Group justify="center" gap="xs">
                      <Button
                        variant="subtle"
                        size="compact-sm"
                        color="blue"
                        onClick={() => {
                          setEditItem(item);
                          setNewItem({ nombre: item.nombre });
                          if (activeTab === 'modelos') {
                            setSelectedMarca(item.marca_id?.toString());
                          }
                          setModalOpen(true);
                        }}
                      >
                        <IconEdit size={16} />
                      </Button>
                      <Button
                        variant="subtle"
                        size="compact-sm"
                        color="red"
                        onClick={() => handleDelete(item.id)}
                      >
                        <IconTrash size={16} />
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </>
    );
  };

  const ModeloForm = () => (
    <>
      <Select
        label="Marca"
        placeholder="Seleccione una marca"
        data={marcas.map(marca => ({
          value: marca.id.toString(),
          label: marca.nombre
        }))}
        value={selectedMarca}
        onChange={setSelectedMarca}
        required
        mb="md"
      />
      <TextInput
        label="Nombre del Modelo"
        placeholder="Ingrese el nombre"
        value={newItem.nombre}
        onChange={(event) => setNewItem({ ...newItem, nombre: event.currentTarget.value })}
        required
        mb="xl"
      />
    </>
  );

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl" style={{ color: '#323130' }}>
        Marcas, Tipos y Modelos
      </Title>
      
      <Tabs 
        defaultValue="marcas" 
        value={activeTab}
        onChange={setActiveTab}
      >
        <Tabs.List>
          <Tabs.Tab value="marcas">Marcas</Tabs.Tab>
          <Tabs.Tab value="tipos">Tipos</Tabs.Tab>
          <Tabs.Tab value="modelos">Modelos</Tabs.Tab>
        </Tabs.List>

        <Paper shadow="sm" p="md" mt="md" radius="md">
          <Tabs.Panel value="marcas">
            <ItemList 
              items={marcas} 
              sortField={sortField}
              sortDirection={sortDirection}
            />
          </Tabs.Panel>
          <Tabs.Panel value="tipos">
            <ItemList 
              items={tipos}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          </Tabs.Panel>
          <Tabs.Panel value="modelos">
            <ItemList 
              items={modelos}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          </Tabs.Panel>
        </Paper>
      </Tabs>

      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setFormError(null);
          setFormSuccess(false);
          setNewItem({ nombre: '' });
          setSelectedMarca(null);
          setEditItem(null);
        }}
        title={`${editItem ? 'Editar' : 'Nuevo'} ${
          activeTab === 'marcas' ? 'Marca' :
          activeTab === 'tipos' ? 'Tipo' :
          'Modelo'
        }`}
        size="md"
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
            Elemento creado correctamente
          </Alert>
        ) : null}

        {activeTab === 'modelos' ? (
          <ModeloForm />
        ) : (
          <TextInput
            label="Nombre"
            placeholder="Ingrese el nombre"
            value={newItem.nombre}
            onChange={(event) => setNewItem({ ...newItem, nombre: event.currentTarget.value })}
            required
            mb="xl"
          />
        )}

        <Group justify="flex-end">
          <Button variant="outline" onClick={() => {
            setModalOpen(false);
            setEditItem(null);
          }}>
            Cancelar
          </Button>
          <Button onClick={editItem ? handleEdit : handleSubmit}>
            {editItem ? 'Actualizar' : 'Guardar'}
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}

export default Marcas;