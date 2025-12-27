'use client';

import { MantineProvider, createTheme } from '@mantine/core';
import { ReactNode } from 'react';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  headings: {
    fontWeight: '700',
  },
  defaultRadius: 'md',
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
