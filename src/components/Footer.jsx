import { AppShell, Text, Group, Button } from '@mantine/core';

function Footer() {
  return (
    <AppShell.Footer p="md">
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          © 2025 Mi Aplicación
        </Text>
        <Group gap="xs" justify="flex-end">
          <Button variant="subtle" size="xs">
            Términos
          </Button>
          <Button variant="subtle" size="xs">
            Privacidad
          </Button>
        </Group>
      </Group>
    </AppShell.Footer>
  );
}

export default Footer;