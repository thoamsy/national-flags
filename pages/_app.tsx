import { useState, useMemo, useEffect } from 'react';
import type { AppProps } from 'next/app';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Navbar from '../components/Navbar';
import '../styles/globals.css';
import ColorModeContext from '../libs/useColorMode';
import { useMediaQuery } from '@mui/material';

function MyApp({ Component, pageProps }: AppProps) {
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');

  const [mode, setMode] = useState<'light' | 'dark'>(isDark ? 'dark' : 'light');

  useEffect(() => {
    const color = localStorage.getItem('colormode') as 'light' | 'dark';
    if (color) {
      setMode(color);
    }
  }, []);

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
