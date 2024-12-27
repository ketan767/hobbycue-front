import React from 'react'
import styles from './ToggleButton.module.css'
import { updateUserByAdmin } from '@/services/admin.service'
import { User } from 'next-auth'

interface FilledButtonProps {
  children?: React.ReactNode
  handleToggle?: (data?: object) => void
  type?: 'button' | 'submit' | 'reset'
  isOn?: boolean
  data?: any
  loading?: boolean
  disable?: boolean
  inviteBtnRef?: React.RefObject<HTMLButtonElement>
}

const ToggleButton: React.FC<FilledButtonProps> = ({
  isOn = false, // Default to false
  handleToggle = () => {}, // Default to no-op
  data,
  disable = false,
}) => {
  let user = {
    ...data,
    is_account_activated: data?.is_account_activated ? false : true,
  }

  const updateUserFunc = async () => {
    console.log(user)

    const { err, res } = await updateUserByAdmin(user?._id, user)
    if (err) {
      console.error(err)
    } else if (res) {
      console.log(res)
      handleToggle()
    } else {
    }
  }

  return (
    <label className={styles.switch}>
      <input
        disabled={disable}
        type="checkbox"
        checked={isOn}
        onChange={() => updateUserFunc()}
      />
      <span className={styles.slider}></span>
    </label>
  )
}

export default ToggleButton
