import React from 'react'
import styles from './input.module.css'

type Props = {
   options: any
}

const InputSelect: React.FC<Props> = ({ options }) => {

   return (
      <select name='select' className={styles.select}>
         {options.map((item: any) => {
            return <option key={item} className={styles.option}>
               {item}
            </option>
         })}
      </select>

   )
}

export default InputSelect
