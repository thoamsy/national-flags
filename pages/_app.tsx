import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from './components/Navbar';
import Container from '@mui/material/Container';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Container style={{ padding: 20 }} maxWidth="lg">
        <Component {...pageProps} />
      </Container>
    </>
  );
}
export default MyApp;
