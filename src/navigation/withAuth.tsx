import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { updateIsLoggedIn } from '@/redux/slices/user'

type ComponentWithInitialProps<P = {}> = React.ComponentType<P> & {
  getInitialProps?: (ctx: any) => Promise<any>
}

export const withAuth = <P extends object>(WrappedComponent: ComponentWithInitialProps<P>) => {
  const Wrapper = (props: P) => {
    const { isLoggedIn } = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
      if (!isLoggedIn) {
        const token = localStorage.getItem('token')
        if (!token) dispatch(updateIsLoggedIn(false))
        else dispatch(updateIsLoggedIn(true))
      }
    }, [isLoggedIn, router])

    // if (!isLoggedIn) {
    //   return null
    // }

    return <WrappedComponent {...props} />
  }

  if (WrappedComponent.getInitialProps) {
    Wrapper.getInitialProps = WrappedComponent.getInitialProps
  }

  return Wrapper as React.ComponentType<any>
}
