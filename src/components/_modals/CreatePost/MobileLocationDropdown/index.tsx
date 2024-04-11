import { FC, useState } from 'react'
import styles from './styles.module.css'

interface MobileLocationDropdownProps {
  currentValue: string
  onChange: (arg0: string) => void
  value: string
  display: string
  options: any[]
  _id: any
  type?: string
}

const MobileLocationDropdown: FC<MobileLocationDropdownProps> = (props) => {
  const { currentValue, onChange, value, display, options, _id, type } = props
  const [open, setOpen] = useState(false)
  const ArrowIcon = () => {
    return (
      <svg
        onClick={(e) => {
          e.stopPropagation()
          if (options) {
            setOpen((prev) => !prev)
          }
        }}
        style={{ rotate: open ? '180deg' : '0deg' }}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_12804_2082)">
          <path
            d="M10.5896 6.195L8.00292 8.78167L5.41625 6.195C5.15625 5.935 4.73625 5.935 4.47625 6.195C4.21625 6.455 4.21625 6.875 4.47625 7.135L7.53625 10.195C7.79625 10.455 8.21625 10.455 8.47625 10.195L11.5363 7.135C11.7963 6.875 11.7963 6.455 11.5363 6.195C11.2763 5.94167 10.8496 5.935 10.5896 6.195Z"
            fill="#6D747A"
          />
        </g>
        <defs>
          <clipPath id="clip0_12804_2082">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    )
  }
  return (
    <div className={styles['option-parent']}>
      <div
        onClick={() => {
          if (type === 'text') {
            onChange(value)
          } else {
            onChange(display.split(' ')[0])
          }
        }}
        className={
          styles['option'] +
          `
        ${
          type === 'text'
            ? currentValue === display
              ? styles['active']
              : ''
            : currentValue === display?.split(' ')[0]
            ? styles['active']
            : ''
        } 
      `
        }
      >
        <p>{display}</p>
        {options && <ArrowIcon />}
      </div>

      {options && open === true && (
        <div className={styles['options-list']}>
          {options?.map((option: any, idx: any) => {
            return (
              <div
                onClick={() => onChange(option.value)}
                key={idx}
                className={
                  styles['child-option'] +
                  ` ${currentValue === option.value ? styles['active'] : ''}`
                }
              >
                <p>{option.display}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MobileLocationDropdown
