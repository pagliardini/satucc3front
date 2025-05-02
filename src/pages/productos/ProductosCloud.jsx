import { Container, Title, Paper, SimpleGrid, Text, List } from '@mantine/core';

function ProductosCloud() {
  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl" style={{ color: '#323130' }}>
        Productos Cloud
      </Title>
      
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Paper shadow="sm" p="lg" radius="md">
          <Title order={3} mb="md">Microsoft Azure</Title>
          <List spacing="sm">
            <List.Item>Azure Virtual Machines</List.Item>
            <List.Item>Azure Functions</List.Item>
            <List.Item>Azure App Service</List.Item>
            <List.Item>Azure DevOps</List.Item>
          </List>
        </Paper>

        <Paper shadow="sm" p="lg" radius="md">
          <Title order={3} mb="md">Servicios Cloud</Title>
          <List spacing="sm">
            <List.Item>Cloud Computing</List.Item>
            <List.Item>Microservicios</List.Item>
            <List.Item>Contenedores Docker</List.Item>
            <List.Item>Kubernetes</List.Item>
          </List>
        </Paper>
      </SimpleGrid>
    </Container>
  );
}

export default ProductosCloud;