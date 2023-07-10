import React from 'react'
import styles from './progressBar.module.css'

type Props = {
  total: any
  current: any
}

export const ProgressBar: React.FC<Props> = ({ total, current }) => {
  return (
    <div className={styles['container']}>
      {[...Array(total)].map((i: any, index: any) => {
        return (
          <>
            <div
              className={`${styles['dot']}  ${
                index < current ? styles['active'] : ''
              } `}
            ></div>
            {index + 1 !== total && (
              <div
                className={`${styles['line']} ${
                  index < current - 1 ? styles['active'] : ''
                } `}
              >
                {' '}
              </div>
            )}
          </>
        )
      })}
    </div>
  )
}
