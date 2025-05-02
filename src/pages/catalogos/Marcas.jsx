import { Container, Title, Tabs, Paper } from '@mantine/core';

function Marcas() {
  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl" style={{ color: '#323130' }}>
        Marcas, Tipos y Modelos
      </Title>
      
      <Tabs defaultValue="marcas">
        <Tabs.List>
          <Tabs.Tab value="marcas">Marcas</Tabs.Tab>
          <Tabs.Tab value="tipos">Tipos</Tabs.Tab>
          <Tabs.Tab value="modelos">Modelos</Tabs.Tab>
        </Tabs.List>

        <Paper shadow="sm" p="md" mt="md" radius="md">
          <Tabs.Panel value="marcas">
            Panel de Marcas
          </Tabs.Panel>
          <Tabs.Panel value="tipos">
            Panel de Tipos
          </Tabs.Panel>
          <Tabs.Panel value="modelos">
            Panel de Modelos
          </Tabs.Panel>
        </Paper>
      </Tabs>
    </Container>
  );
}

export default Marcas;