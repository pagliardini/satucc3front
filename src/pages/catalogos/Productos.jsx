import { Container, Title, Paper, SimpleGrid, Text, Button, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

function Productos() {
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
      
      <Paper shadow="sm" p="md" radius="md">
        {/* Aquí irá la tabla de productos */}
        <Text>Lista de productos...</Text>
      </Paper>
    </Container>
  );
}

export default Productos;