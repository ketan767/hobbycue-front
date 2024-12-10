import React, { useState } from 'react'
import styles from './AdminNote.module.css'
import CloseIcon from '@/assets/icons/CloseIcon'
import approve from '@/assets/icons/adminNote/Status-Approve-Resolve.png'
import newItem from '@/assets/icons/adminNote/Status-New.png'
import pending from '@/assets/icons/adminNote/Status-Pending.png'
import reject from '@/assets/icons/adminNote/Status-Reject-Dismiss.png'
import ticket from '@/assets/icons/adminNote/Status-Ticket.png'
import Image, { StaticImageData } from 'next/image'

interface MenuItem {
  icon: StaticImageData
  text: string
}

const menuItems: MenuItem[] = [
  { icon: newItem, text: 'New' },
  { icon: pending, text: 'In Progress' },
  { icon: approve, text: 'Approve' },
  { icon: reject, text: 'Rejected' },
  { icon: ticket, text: 'Ticket' },
]

interface PropTypes {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isModalOpen: boolean
}

const AdminNote: React.FC<PropTypes> = ({ setIsModalOpen, isModalOpen }) => {
  const [adminNotes, setAdminNotes] = useState<string>('')
  const [status, setStatus] = useState<string>('In Progress')
  const [emailUser, setEmailUser] = useState<boolean>(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    setIsDropdownOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ adminNotes, status, emailUser })
  }

  return (
    <div
      className={`${styles.modalOverlay} ${
        isModalOpen ? styles.showOverlay : ''
      }`}
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className={`${styles.modalContent} ${
          isModalOpen ? styles.slideIn : styles.slideOut
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <section className={styles.mainContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>Admin Note</h1>
            <CloseIcon
              className={styles['modal-close-icon']}
              onClick={() => setIsModalOpen(false)}
            />
          </div>

          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.notesSection}>
                <label className={styles.label} htmlFor="adminNotes">
                  Admin Notes
                </label>
                <textarea
                  className={styles.textarea}
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              <div className={styles.optionsContainer}>
                <div className={styles.statusContainer}>
                  <label className={styles.label}>Status</label>
                  <div
                    className={styles.dropdown}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                  >
                    <div className={styles.selectedOption}>
                      <Image
                        src={
                          menuItems.find((item) => item.text === status)
                            ?.icon || ''
                        }
                        alt={status}
                        width={20}
                        height={20}
                      />
                      <span>{status}</span>
                    </div>
                    {isDropdownOpen && (
                      <ul className={styles.dropdownMenu}>
                        {menuItems.map((item, index) => (
                          <li
                            key={index}
                            className={styles.dropdownItem}
                            onClick={() => {
                              handleStatusChange(item.text)

                              setIsDropdownOpen((prev) => !prev)
                            }}
                          >
                            <Image
                              src={item.icon}
                              alt={item.text}
                              width={20}
                              height={20}
                            />
                            <span>{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className={styles.emailContainer}>
                  <label className={styles.label} htmlFor="emailUser">
                    Email User:
                  </label>
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    id="emailUser"
                    checked={emailUser}
                    onChange={(e) => setEmailUser(e.target.checked)}
                  />
                </div>
                <button className={styles.saveButton} type="submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminNote
