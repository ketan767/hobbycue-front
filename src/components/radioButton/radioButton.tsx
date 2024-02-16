import React from 'react'
import styles from './radioButton.module.css'

type Props = { active: any, disabled?:boolean }

const RadioButton: React.FC<Props> = ({active,disabled}) => {

   return (
      <button className={`${styles.container} ${active === true ? styles.active : ''}`} disabled={disabled??false}>
         <div className={`${styles.circle} ${active === true ? styles.activeCircle : styles.inactiveCircle}`}></div>
      </button>
   )
}

export default RadioButton
