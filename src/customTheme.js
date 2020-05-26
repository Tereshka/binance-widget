import { theme } from '@chakra-ui/core';

// Let's say you want to add custom colors
const customTheme = {
  ...theme,
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'system-ui, sans-serif',
    mono: 'system-ui, sans-serif',
  },
  colors: {
    ...theme.colors,
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
  },
};

export default customTheme;