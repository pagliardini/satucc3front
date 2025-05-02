import { Container, Title, Text, Paper, SimpleGrid, Group, Progress, Stack, RingProgress } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ene', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Abr', value: 800 },
  { name: 'May', value: 500 },
];

const activities = [
  { task: 'Reunión de equipo', progress: 80 },
  { task: 'Desarrollo de features', progress: 60 },
  { task: 'Testing', progress: 30 },
];

function Dashboard() {
  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl" style={{ color: '#323130' }}>
        Dashboard
      </Title>
      
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        <Paper shadow="sm" p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Title order={3}>Estadísticas</Title>
          </Group>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0078D4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Text size="sm" c="dimmed" mt="md">
            Resumen mensual de actividad
          </Text>
        </Paper>

        <Paper shadow="sm" p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Title order={3}>Actividades</Title>
          </Group>
          <Stack>
            {activities.map((activity, index) => (
              <div key={index}>
                <Text size="sm" mb={4}>{activity.task}</Text>
                <Progress 
                  value={activity.progress} 
                  size="sm"
                  color={activity.progress > 70 ? 'green' : activity.progress > 40 ? 'blue' : 'red'}
                />
              </div>
            ))}
          </Stack>
        </Paper>

        <Paper shadow="sm" p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Title order={3}>Progreso General</Title>
          </Group>
          <Group justify="center" mt="md">
            <RingProgress
              size={150}
              thickness={12}
              sections={[
                { value: 40, color: 'cyan' },
                { value: 30, color: 'blue' },
                { value: 20, color: 'indigo' },
              ]}
              label={
                <Text ta="center" size="lg" fw={700}>
                  90%
                </Text>
              }
            />
          </Group>
          <Text size="sm" c="dimmed" ta="center" mt="md">
            Objetivo trimestral
          </Text>
        </Paper>
      </SimpleGrid>
    </Container>
  );
}

export default Dashboard;