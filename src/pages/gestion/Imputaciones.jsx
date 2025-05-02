import { Container, Title, Paper, Group, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

function Imputaciones() {
  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1} style={{ color: '#323130' }}>
          Imputaciones
        </Title>
        <Button leftSection={<IconPlus size={14} />}>
          Nueva Imputación
        </Button>
      </Group>
      
      <Paper shadow="sm" p="md" radius="md">
        {/* Aquí irá la tabla de imputaciones */}
      </Paper>
    </Container>
  );
}

export default Imputaciones;