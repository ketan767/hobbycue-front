import { ReactElement } from 'react'
import { Navbar } from '../Navbar/Navbar'
import ModalManager from '../_modals/ModalManager'
import { withAuth } from '@/navigation/withAuth'

// REVIEW: Not is use at present
function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <Navbar />
      <ModalManager />
      <main style={{ marginTop: 'var(--navbar-height-desktop)' }}>{children}</main>
      {/* <Footer /> */}
    </>
  )
}

export default withAuth(Layout)
