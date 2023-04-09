import { ReactElement } from 'react'
import { Navbar } from '../Navbar/Navbar'
import ModalManager from '../_modals/ModalManager'

// REVIEW: Not is use at present
export default function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <ModalManager />
      {/* <Footer /> */}
    </>
  )
}
