import React from 'react'
import styles from './input.module.css'

type Props = {
   options: any
   onChange? : any
   value? : any
}

const InputSelect: React.FC<Props> = ({  options, onChange, value }) => {

   return (
      <select name='select' className={styles.select} onChange={(e:any) => onChange(e.target.value)} value={value} >
         {options.map((item: any) => {
            return <option key={item} className={styles.option}>
               {item}
            </option>
         })}
      </select>

   )
}

export default InputSelect
