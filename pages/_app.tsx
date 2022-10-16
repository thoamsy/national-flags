import { useState, useMemo } from 'react';
import type { AppProps } from 'next/app';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Navbar from './components/Navbar';
import '../styles/globals.css';
import { ColorModeContext } from './useColorMode';
import { useMediaQuery } from '@mui/material';

function MyApp({ Component, pageProps }: AppProps) {
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  console.log(isDark);

  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const systemMode = isDark ? 'dark' : 'light';
    const color =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('colormode')
        : systemMode;
    if (color) {
      return color;
    }
    return systemMode;
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const nextMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('colormode', nextMode);
          return nextMode;
        });
      },
      color: mode,
    }),
    [mode],
  );
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Paper
          style={{ minHeight: 'calc(100vh - 56px)', borderRadius: 0 }}
          elevation={0}
        >
          <Container style={{ padding: 20 }} maxWidth="lg">
            <Component {...pageProps} />
          </Container>
        </Paper>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
export default MyApp;
