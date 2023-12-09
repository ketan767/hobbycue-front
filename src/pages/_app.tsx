import { useRef, useEffect, useMemo, useState } from 'react'
import { Provider } from 'react-redux'
import Head from 'next/head'
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles'
import type { AppProps } from 'next/app'

import store from '@/redux/store'
import SiteMainLayout from '@/layouts'
import SiteAdminLayout from '@/AdminLayout'
import '@/styles/_globals.css'
import { useRouter } from 'next/router'
import LoadingBackdrop from '@/components/PageLoader'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [scrollPosition, setScrollPosition] = useState(0);


  const isAdminPage = router.pathname.startsWith('/admin')
  const theme = createTheme({
    palette: {
      primary: {
        main: 'rgb(127, 99, 161)',
        light: 'blue',
        dark: 'rgba(127, 99, 170)',
        contrastText: 'white',
      },
      secondary: {
        light: 'red',
        main: 'red',
        dark: 'red',
        contrastText: 'red',
      },
    },
  })


//profile,hobby,page pages scroll remember code 
  const handleRouteChange = () => {
      setScrollPosition(window.scrollY);
  };

  // Restore the scroll position when navigating back to a page within the "page" folder
  const handleRouteChangeComplete = () => {
    if (router.pathname.startsWith('/page/')) {
      window.scrollTo(0, scrollPosition);
    }
    if (router.pathname.startsWith('/profile/')) {
      window.scrollTo(0, scrollPosition);
    }
    if (router.pathname.startsWith('/hobby/')) {
      window.scrollTo(0, scrollPosition);
    }
  };

  // Attach event listeners
  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events, scrollPosition]);





  return (
    <>
      <Head>
        <title>HobbyCue - Your Hobby, Your Community</title>
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            {isAdminPage ? (
              <SiteAdminLayout>
                <Component {...pageProps} />
              </SiteAdminLayout>
            ) : (
              <SiteMainLayout>
                <Component {...pageProps} />
              </SiteMainLayout>
            )}
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}

export default App
