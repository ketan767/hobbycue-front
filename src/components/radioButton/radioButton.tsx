import React from 'react'
import styles from './radioButton.module.css'

type Props = { active: any }

const RadioButton: React.FC<Props> = ({active }) => {

   return (
      <div className={`${styles.container} ${active === true ? styles.active : ''}`}>
         <div className={`${styles.circle} ${active === true ? styles.activeCircle : styles.inactiveCircle}`}></div>
      </div>
   )
}

export default RadioButton
