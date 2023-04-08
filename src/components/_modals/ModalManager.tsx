import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { SignInModal } from './AuthModal'
import { Dialog, Modal } from '@mui/material'
import { closeModal } from '@/redux/slices/modal'
import { VerifyEmailModal } from './VerifyEmail'

const ModalManager = () => {
  const dispatch = useDispatch()

  const activeModal = useSelector((state: RootState) => state.modal.activeModal)

  function handleClose() {
    dispatch(closeModal())
  }
  return (
    <>
      <Dialog open={Boolean(activeModal)} closeAfterTransition onClose={handleClose}>
        <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
          {activeModal === 'auth' && <SignInModal />}
          {activeModal === 'email-verify' && <VerifyEmailModal />}
        </div>
      </Dialog>
    </>
  )
}

export default ModalManager
