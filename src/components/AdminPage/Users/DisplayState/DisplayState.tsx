import React from 'react'
import styles from './DisplayState.module.css'
import { ModalState } from '@/pages/admin/users'
import { formatDate } from '../../Filters/UserFilter/UserFilter'
import { format } from 'path'
import { HobbyModalState } from '../../Modal/HobbiesFilterModal/HobbiesFilter'
import { CommunitiesModalState } from '../../Filters/CommunityFilter/CommunityFilter'
import { PostModalState } from '../../Filters/PostsFilter/PostsFilter'

interface Props {
  modalState: ModalState | HobbyModalState | CommunitiesModalState | PostModalState
}

const DisplayState: React.FC<Props> = ({ modalState }) => {
  const displayState = () => {
    return Object.entries(modalState).map(([key, value]) => {
      if (key === 'onboarded' && typeof value === 'string' && value) {
        // For 'onboarded', display 'Onb'
        return (
          <div key={key} className={styles.stateItem}>
            <strong>Onb:</strong> {value.slice(0, 1).toUpperCase()}{' '}
          </div>
        )
      } else if (key === 'joined' && typeof value === 'object' && value) {
        // For 'joined', handle start and end date logic
        const { start, end } = value
        if (start && !end) {
          return (
            <div key={key} className={styles.stateItem}>
              <span className={styles.divider}>|</span>
              <strong>joined: {`>`} </strong> {`${formatDate(start)}`}
            </div>
          )
        } else if (!start && end) {
          return (
            <div key={key} className={styles.stateItem}>
              <span className={styles.divider}>|</span>
              <strong>joined: {`>`} </strong> {`${formatDate(end)}`}
            </div>
          )
        } else if (start && end) {
          return (
            <div key={key} className={styles.stateItem}>
              <span className={styles.divider}>|</span>
              <strong>joined:</strong>{' '}
              {`${formatDate(start)} - ${formatDate(end)}`}
            </div>
          )
        }
      } else if (Array.isArray(value) && value.length > 0) {
        console.log(value)
        return (
          <div key={key} className={styles.stateItem}>
            <span className={styles.divider}>|</span>
            <strong>{key}:</strong>{' '}
            <span style={{ textTransform: 'uppercase' }}>
              {value.map((x) => x.slice(0, 1)).join(', ')}
            </span>
          </div>
        )
      } else if (typeof value === 'object' && value) {
        // For objects, display in compact form
        const filteredObject = Object.entries(value).filter(([, v]) => v !== '');
        if (filteredObject.length > 0) {
          return (
            <div key={key} className={styles.stateItem}>
              <span className={styles.divider}>|</span>
              <strong>{key}:</strong>{' '}
              {filteredObject
                .map(([subKey, subValue]) => {
                  // Check if subValue is a Date
                  if (subValue instanceof Date) {
                    return ` ${formatDate(subValue)}`;
                  }
                  return ` ${subValue}`;
                })
                .join('- ')}
            </div>
          );
        }
      }
       else if (typeof value === 'string' && value) {
        // For all other strings, display in one line
        return (
          <div key={key} className={styles.stateItem}>
            <span className={styles.divider}>|</span>
            <strong>{key}:</strong> {value}
          </div>
        )
      }
      return null
    })
  }

  return <div className={styles.modal}>{displayState()}</div>
}

export default DisplayState
