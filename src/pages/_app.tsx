import { Provider } from 'react-redux'
import Head from 'next/head'
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import type { AppProps } from 'next/app'

import store from '@/redux/store'
import MainLayout from '@/components/_layouts'

import '@/styles/_globals.css'

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

  return (
    <>
      <Head>
        <title>HobbyCue - Your Hobby, Your Community</title>
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}

export default App
