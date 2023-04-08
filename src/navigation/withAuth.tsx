import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

type ComponentWithInitialProps<P = {}> = React.ComponentType<P> & {
  getInitialProps?: (ctx: any) => Promise<any>
}

export const withAuth = <P extends object>(WrappedComponent: ComponentWithInitialProps<P>) => {
  const Wrapper = (props: P) => {
    const { isLoggedIn } = useSelector((state: RootState) => state.user)
    const router = useRouter()

    useEffect(() => {
      if (!isLoggedIn) {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
        }
      }
    }, [isLoggedIn, router])

    if (!isLoggedIn) {
      return null
    }

    return <WrappedComponent {...props} />
  }

  if (WrappedComponent.getInitialProps) {
    Wrapper.getInitialProps = WrappedComponent.getInitialProps
  }

  return Wrapper as React.ComponentType<any>
}
