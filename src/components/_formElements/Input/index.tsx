import React from 'react'
import styles from './Input.module.css'

import TextField from '@mui/material/TextField'

type Props = {
  type: string
  value?: string
  placeholder?: string
  error?: boolean
  disabled?: boolean
  helperText?: string | null
  className?: string
  onChange?: (e: any) => void
}

const FormInput: React.FC<Props> = (props) => {
  const {
    type,
    value,
    placeholder,
    error,
    helperText,
    className,
    onChange,
    disabled,
  } = props

  return (
    <>
      <TextField
        className={`${styles['input-field']} ${className} textFieldClass`}
        fullWidth
        placeholder={placeholder}
        type={type}
        error={error}
        helperText={helperText}
        disabled={disabled}
        variant="outlined"
        size="small"
        value={value}
        onChange={onChange}
        InputLabelProps={{ shrink: false }}
      />
    </>
  )
}

export default FormInput
