import { AuthProvider } from '../providers/AuthProvider';
import '../styles/globals.css';
import { MantineProvider } from '@mantine/core';

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
        spacing: {
          xl: 100,
        },
      }}
    >
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </MantineProvider>
  );
}

export default MyApp;
