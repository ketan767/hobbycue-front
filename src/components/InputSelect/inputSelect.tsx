import React, { useState } from 'react'
import styles from './input.module.css'

type Props = {
  options: any
  onChange?: any
  value?: any
  name?: any
}

const InputSelect: React.FC<Props> = ({ options, onChange, value, name }) => {
  const [selectWidth, setSelectWidth] = useState((value.length*10+50)+'px')
  const handleChange = (option:string) => {
   let length=(option.length*10+50)+'px'
   setSelectWidth(length)
  }
  return (
    <select
      name={name}
      className={styles.select}
      onChange={(e: any) => {
        onChange({ name: e.target.name, value: e.target.value })
        handleChange(e.target.value)
      }}
      value={value}
      style={{width:selectWidth}}
    >
      {options.map((item: any) => {
        return (
          <option key={item} className={styles.option}>
            {item}
          </option>
        )
      })}
    </select>
  )
}

export default InputSelect
