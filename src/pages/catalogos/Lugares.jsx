import { Container, Title, Paper, Group, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

function Lugares() {
  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1} style={{ color: '#323130' }}>
          Lugares
        </Title>
        <Button leftSection={<IconPlus size={14} />}>
          Nuevo Lugar
        </Button>
      </Group>
      
      <Paper shadow="sm" p="md" radius="md">
        {/* Aquí irá la tabla de lugares */}
      </Paper>
    </Container>
  );
}

export default Lugares;