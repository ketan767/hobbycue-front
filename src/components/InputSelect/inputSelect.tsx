import React from 'react'
import styles from './input.module.css'

type Props = {
  options: any
  onChange?: any
  value?: any
}

const DropdownArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    style={{
      position: 'absolute',
      top: '50%',
      right: '12px',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
    }}
  >
    <path
      d="M10.5876 6.19347L8.00096 8.78014L5.4143 6.19347C5.1543 5.93347 4.7343 5.93347 4.4743 6.19347C4.2143 6.45347 4.2143 6.87347 4.4743 7.13347L7.5343 10.1935C7.7943 10.4535 8.2143 10.4535 8.4743 10.1935L11.5343 7.13347C11.7943 6.87347 11.7943 6.45347 11.5343 6.19347C11.2743 5.94014 10.8476 5.93347 10.5876 6.19347Z"
      fill="#6D747A"
    />
  </svg>
)

const InputSelect: React.FC<Props> = ({ options, onChange, value }) => {
  return (
    <div style={{ position: 'relative' }}>
      <select
        name="select"
        className={styles.select}
        onChange={(e: any) => {
          onChange(e.target.value)
        }}
        value={value}
        style={{ paddingRight: '30px' }}
      >
        {options.map((item: any) => {
          return (
            <option key={item} className={styles.option}>
              {item}
            </option>
          )
        })}
      </select>
      <DropdownArrow />
    </div>
  )
}

export default InputSelect
