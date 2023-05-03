import { useEffect } from 'react'
import { Provider } from 'react-redux'
import Head from 'next/head'
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import type { AppProps } from 'next/app'

import store from '@/redux/store'
import SiteMainLayout from '@/layouts'

import '@/styles/_globals.css'
import { useRouter } from 'next/router'

function App({ Component, pageProps }: AppProps) {
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

  const router = useRouter()

  useEffect(() => {
    const handleStart = (url: any, { shallow }: any) => {
      console.time('Loading Time!')
      console.log(`App is changing to ${url} ${shallow ? 'with' : 'without'} shallow routing`)
    }
    const handleComplete = () => {
      console.log('Loading Completed..')
      console.timeEnd('Loading Time')
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return (
    <>
      <Head>
        <title>HobbyCue - Your Hobby, Your Community</title>
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <SiteMainLayout>
              <Component {...pageProps} />
            </SiteMainLayout>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}

export default App
