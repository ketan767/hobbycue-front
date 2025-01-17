import React from 'react'
import styles from './AdminToggle.module.css'
import { updateUserByAdmin } from '@/services/admin.service'
import { User } from 'next-auth'

interface FilledButtonProps {
  children?: React.ReactNode
  handleToggle?: () => void
  type?: 'button' | 'submit' | 'reset'
  isOn?: boolean
  loading?: boolean
  disable?: boolean
  inviteBtnRef?: React.RefObject<HTMLButtonElement>
}

const AdminToggleButton: React.FC<FilledButtonProps> = ({
  isOn = false, // Default to false
  handleToggle = () => {}, // Default to no-op
  
  disable = false,
}) => {
 

  const handleChange = async (e : any) => {
    e.preventDefault();
    handleToggle();
    
    // const { err, res } = await updateUserByAdmin(user?._id, user)
    // if (err) {
    //   console.error(err)
    // } else if (res) {
    //   console.log(res)
    //   handleToggle()
    // } else {
    // }
  }

  return (
    <label className={styles.switch}>
      <input
        disabled={disable}
        type="checkbox"
        checked={isOn}
        onChange={handleChange}
      />
      <span className={styles.slider}></span>
    </label>
  )
}

export default AdminToggleButton
