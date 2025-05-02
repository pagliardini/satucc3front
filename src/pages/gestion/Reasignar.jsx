import { Container, Title, Paper, Group, Button } from '@mantine/core';
import { IconArrowsExchange } from '@tabler/icons-react';

function Reasignar() {
  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1} style={{ color: '#323130' }}>
          Reasignar
        </Title>
        <Button leftSection={<IconArrowsExchange size={14} />}>
          Nueva Reasignación
        </Button>
      </Group>
      
      <Paper shadow="sm" p="md" radius="md">
        {/* Aquí irá la tabla de reasignaciones */}
      </Paper>
    </Container>
  );
}

export default Reasignar;