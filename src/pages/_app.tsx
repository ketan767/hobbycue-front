import SiteAdminLayout from '@/AdminLayout'
import ScrollToTop from '@/components/ScrollToTop'
import SiteMainLayout from '@/layouts'
import store from '@/redux/store'
import '@/styles/_globals.css'
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from '@mui/material/styles'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [scrollPosition, setScrollPosition] = useState(0)

  const isAdminPage =
    router.pathname.startsWith('/server-sitemap.xml') ||
    router.pathname.startsWith('/sitemap') ||
    router.pathname.startsWith('/admin')
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

  useEffect(() => {
    const savedScrollPosition = localStorage.getItem('scrollPosition')
    if (savedScrollPosition) {
      console.log('Restoring scroll position:', savedScrollPosition)
      window.scrollTo(0, parseInt(savedScrollPosition, 10))
      localStorage.removeItem('scrollPosition')
    } else {
      console.log('No saved scroll position found')
    }

    const handleRouteChange = () => {
      console.log('Saving scroll position:', window.scrollY)
      localStorage.setItem('scrollPosition', window.scrollY.toString())
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
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
                <>
                  <Component {...pageProps} />
                  <ScrollToTop />
                </>
              </SiteMainLayout>
            )}
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}

export default App
