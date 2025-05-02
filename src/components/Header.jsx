import { AppShell, Burger, Group, Title } from '@mantine/core';

function Header({ opened, toggle }) {
  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title 
            order={3}
            style={{
              fontFamily: 'Segoe UI',
              color: '#0078D4',
              fontSize: '20px',
            }}
          >
            SATUCC3
          </Title>
        </Group>
      </Group>
    </AppShell.Header>
  );
}

export default Header;