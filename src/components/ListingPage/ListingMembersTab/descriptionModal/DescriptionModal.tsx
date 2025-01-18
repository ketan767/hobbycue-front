import { Fade, Modal } from '@mui/material'
import React from 'react'
import styles from '../ListingMembersTab.module.css'
import AdminActionModal from '@/components/_modals/AdminModals/ActionModal'

type DescriptionModalProps = {
  showAdminActionModal: boolean
  setShowAdminActionModal: (val: boolean) => void
  memberData: any
  setMemberdata: (data: any) => void
  handleSubmit: () => void
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({
  showAdminActionModal,
  setShowAdminActionModal,
  memberData,
  setMemberdata,
  handleSubmit,
}) => {
  const CustomBackdrop = () => {
    return <div className={styles['custom-backdrop']}></div>
  }

  return (
    <>
      {showAdminActionModal && (
        <Modal
          open
          onClose={() => {
            setShowAdminActionModal(false)
          }}
          slots={{ backdrop: CustomBackdrop }}
          disableEscapeKeyDown
          closeAfterTransition
        >
          <Fade>
            <div className={styles['modal-wrapper']}>
              <main className={styles['pos-relative']}>
                <AdminActionModal
                  data={memberData}
                  setData={setMemberdata}
                  handleSubmit={handleSubmit}
                  handleClose={() => setShowAdminActionModal(false)}
                />
              </main>
            </div>
          </Fade>
        </Modal>
      )}
    </>
  )
}

export default DescriptionModal
