import React, { useState, useRef, useEffect } from 'react'
import styles from './HobbiesNotesModal.module.css'
import CloseIcon from '@/assets/icons/CloseIcon'
import approve from '@/assets/icons/adminNote/Status-Approve-Resolve.png'
import newItem from '@/assets/icons/adminNote/Status-New.png'
import pending from '@/assets/icons/adminNote/Status-Pending.png'
import reject from '@/assets/icons/adminNote/Status-Reject-Dismiss.png'
import ticket from '@/assets/icons/adminNote/Status-Ticket.png'
import Image, { StaticImageData } from 'next/image'
import {
    UpdateHobbyreq
  } from '@/services/admin.service'
import { AdminNoteModalData } from '@/pages/admin/hobbies'

interface MenuItem {
  icon: StaticImageData
  text: string
}

const menuItems: MenuItem[] = [
  { icon: newItem, text: 'New' },
  { icon: pending, text: 'in_progress' },
  { icon: approve, text: 'accepted' },
  { icon: reject, text: 'rejected' },
  { icon: ticket, text: 'Ticket' },
]

interface PropTypes {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setAdminNoteModalData?: React.Dispatch<
    React.SetStateAction<AdminNoteModalData>
  >
  isModalOpen: boolean
  pageName?: String
  data?: any
}

const HobbiesNotesModal: React.FC<PropTypes> = ({
  setIsModalOpen,
  isModalOpen,
  setAdminNoteModalData,
  data,
  pageName,
}) => {
  const [adminNotes, setAdminNotes] = useState<string>(data?.admin_notes || "")
  const [status, setStatus] = useState<string>(data?.status || 'in_progress')
  const [emailUser, setEmailUser] = useState<boolean>(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (data) {
      setAdminNotes(data?.admin_notes || ""); 
      setStatus(data?.status || "in_progress"); 
      setEmailUser(false); 
    }
  }, [data]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    setIsDropdownOpen(false)
  }
  console.log(data)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const updatedData = {
        adminNotes,
        status,
        emailUser,
        userId: data?._id,
      };

    console.log({ adminNotes, status, emailUser })
    if (pageName === 'HobbyRequest') {
        try {
          
          const { err, res } = await UpdateHobbyreq({
            user_id: data?.user_id?._id,
            listing_id: data?.listing_id?._id,
            hobby: data?.hobby,
            description: adminNotes,
            status,
          });
  
          if (err) {
            console.error('Error updating HobbyRequest:', err);
          } else {
            console.log('HobbyRequest updated successfully:', res);
            setAdminNoteModalData && setAdminNoteModalData(updatedData); 
          }
        } catch (error) {
          console.error('Error submitting admin note:', error);
        }
      }
    setIsModalOpen(false)
  }

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsDropdownOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  if (!isModalOpen) {
    return null
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
                    ref={dropdownRef}
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

export default HobbiesNotesModal
