import { Container, Title, Text, SimpleGrid, Card } from '@mantine/core';

function Configuracion() {
  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg" style={{ color: '#323130' }}>
        Configuración
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        <Card shadow="sm" padding="lg">
          <Title order={3} mb="md">Configuración 1</Title>
          <Text>Opcion de configuración 1</Text>
        </Card>
        <Card shadow="sm" padding="lg">
          <Title order={3} mb="md">Configuración 2</Title>
          <Text>Opcion de configuración 2</Text>
        </Card>
        <Card shadow="sm" padding="lg">
          <Title order={3} mb="md">Configuración 3</Title>
          <Text>Opcion de configuración 3</Text>
        </Card>
      </SimpleGrid>
    </Container>
  );
}

export default Configuracion;