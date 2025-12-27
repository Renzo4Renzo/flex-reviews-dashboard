'use client';

import { Button, Container, Stack, Title, Text } from '@mantine/core';

export default function Home() {
  return (
    <Container size="sm" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack gap="lg" align="center">
        <Title order={1}>Flex Reviews Dashboard</Title>
        <Text c="dimmed" ta="center">
          Mantine UI is successfully configured! This is a test page to verify the setup.
        </Text>
        <Button variant="filled" size="lg">
          Test Mantine Button
        </Button>
        <Button variant="outline" size="md">
          Outline Button
        </Button>
        <Button variant="light" size="sm">
          Light Button
        </Button>
      </Stack>
    </Container>
  );
}
