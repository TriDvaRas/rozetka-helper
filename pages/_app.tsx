import '../styles/globals.css'
import '../styles/styles.sass'
// import 'bootstrap'
// import 'bootstrap-darkmode'
import type { AppProps } from 'next/app'
import { ThemeConfig, writeDarkSwitch } from 'bootstrap-darkmode';
import { useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const themeConfig = new ThemeConfig();
    // place customizations here
    // themeConfig.initTheme();
  }, [])

  return <Container className='my-3'>
    <Component {...pageProps} />
  </Container>
}
