import { Container, Title, Paper, Group, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

function Compras() {
  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1} style={{ color: '#323130' }}>
          Compras
        </Title>
        <Button leftSection={<IconPlus size={14} />}>
          Nueva Compra
        </Button>
      </Group>
      
      <Paper shadow="sm" p="md" radius="md">
        {/* Aquí irá la tabla de compras */}
      </Paper>
    </Container>
  );
}

export default Compras;