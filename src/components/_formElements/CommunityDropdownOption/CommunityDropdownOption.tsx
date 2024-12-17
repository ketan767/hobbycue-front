import React, { useState } from 'react'
import styles from './styles.module.css'
import ChevronDown from '@/assets/svg/chevron-up.svg'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { setIsPinCode } from '@/redux/slices/post'

type Props = {
  type: String
  value: String
  currentValue: String
  display: String
  options: any
  onChange: any
  _id: any
  pencil?: boolean
  onClick?: () => void
  smallPencil?: boolean
  maxWidth?: string
}

export const CommunityDropdownOption: React.FC<Props> = (props) => {
  const {
    value,
    display,
    options,
    onChange,
    currentValue,
    _id,
    pencil,
    onClick,
    smallPencil,
    maxWidth,
  } = props

  const dispatch = useDispatch()

  const { activeProfile, user } = useSelector((state: any) => state.user)

  const [active, setActive] = useState(
    user?.primary_address?._id === _id ? true : false,
  )

  const toggle = (e: any) => {
    e.stopPropagation()
    setActive(!active)
  }

  return (
    <div
      onClick={
        pencil
          ? (e) => {
              toggle(e)
              onClick?.()
            }
          : options?.length > 0
          ? (e) => {
              if ((e.target as HTMLElement).textContent === display) {
                onChange(props)
              }
            }
          : () => {
              onChange(props)
            }
      }
      style={{ maxWidth }}
      className={
        styles['dropdown-container'] +
        ` ${pencil && styles['pencil-container']}`
      }
    >
      <p
        className={
          [
            pencil ? styles.editText : active ? styles.purpleText : styles.normalText,
            display === 'Edit Location' || display === 'Edit Hobbies' ? styles.purpleText : ""
          ]
            .filter(Boolean) 
            .join(" ")
        }
        
      >
        {display}
      </p>
      {pencil && smallPencil ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <g clip-path="url(#clip0_9384_162714)">
            <path
              d="M1.5 8.62625V10.5013H3.375L8.905 4.97125L7.03 3.09625L1.5 8.62625ZM10.355 3.52125C10.55 3.32625 10.55 3.01125 10.355 2.81625L9.185 1.64625C8.99 1.45125 8.675 1.45125 8.48 1.64625L7.565 2.56125L9.44 4.43625L10.355 3.52125Z"
              fill="#8064A2"
            />
          </g>
          <defs>
            <clipPath id="clip0_9384_162714">
              <rect width="12" height="12" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ) : pencil ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <g clip-path="url(#clip0_6269_107832)">
            <path
              d="M2.5 11.5017V14.0017H5L12.3733 6.62833L9.87333 4.12833L2.5 11.5017ZM14.3067 4.695C14.5667 4.435 14.5667 4.015 14.3067 3.755L12.7467 2.195C12.4867 1.935 12.0667 1.935 11.8067 2.195L10.5867 3.415L13.0867 5.915L14.3067 4.695Z"
              fill="#8064A2"
            />
          </g>
          <defs>
            <clipPath id="clip0_6269_107832">
              <rect
                width="16"
                height="16"
                fill="white"
                transform="translate(0.5)"
              />
            </clipPath>
          </defs>
        </svg>
      ) : null}
      {options?.length > 0 && (
        <svg
          onClick={toggle}
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <g clip-path="url(#clip0_3714_58515)">
            <path
              d="M11.3904 6.195L8.8037 8.78167L6.21703 6.195C5.95703 5.935 5.53703 5.935 5.27703 6.195C5.01703 6.455 5.01703 6.875 5.27703 7.135L8.33703 10.195C8.59703 10.455 9.01703 10.455 9.27703 10.195L12.337 7.135C12.597 6.875 12.597 6.455 12.337 6.195C12.077 5.94167 11.6504 5.935 11.3904 6.195Z"
              fill="#6D747A"
            />
          </g>
          <defs>
            <clipPath id="clip0_3714_58515">
              <rect
                width="16"
                height="16"
                fill="white"
                transform="translate(0.804688)"
              />
            </clipPath>
          </defs>
        </svg>
      )}
      {active && options?.length > 0 && (
        <div style={{ maxWidth }} className={styles['options-container']}>
          {options?.map(
            (item: { value: string; display: string }, i: number) => (
              <div
                style={{ maxWidth }}
                onClick={(e) => {
                  if (item?.display?.includes('PIN Code'))
                    dispatch(setIsPinCode(true))
                  else dispatch(setIsPinCode(false))

                  onChange(item)
                  document.documentElement.click()
                }}
                className={
                  styles.option +
                  ` ${currentValue === item?.value ? styles.activeOption : ''}`
                }
                key={i}
              >
                <div className={styles.optionTextContainer}>
                  <p>{item.display}</p>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}
