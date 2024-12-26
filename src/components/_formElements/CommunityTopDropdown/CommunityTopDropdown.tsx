import React, { useState, useRef, useEffect } from 'react'
import styles from './style.module.css'

type Props = {
  value: any
  children: any
  className?: any
  variant?: 'primary' | 'secondary'
  maxWidth?: string
}

const CommunityTopDropdown: React.FC<Props> = ({
  value,
  children,
  className,
  variant = 'primary',
  maxWidth,
}) => {
  const [active, setactive] = useState(false)
  const toggle = () => setactive(!active)
  const dropdownRef = useRef(null)
  const containerRef = useRef<HTMLDivElement>(null)
  //console.log({variant})
  useEffect(() => {
    const closeDropdown = () => {
      setactive(false)
    }

    if (active) {
      document.addEventListener('click', closeDropdown)
    } else {
      document.removeEventListener('click', closeDropdown)
    }

    return () => {
      document.removeEventListener('click', closeDropdown)
    }
  }, [active])

  const handleHeaderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    toggle()
  }

  const handleChildClick = () => {
    setactive(false)
  }
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setactive(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])
  //console.log({ value })

  return (
    <div
      ref={containerRef}
      className={`${variant === 'primary' && styles.primary} ${
        variant === 'secondary' && styles.secondary
      } ${className ? className : ''} ${styles.container}`}
    >
      <header className={styles.header} onClick={handleHeaderClick}>
        <p>{value ? value : 'Select...'}</p>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          transform={active ? 'rotate(180)' : 'rotate(0)'}
        >
          <g id="expand_more_black_24dp 1" clip-path="url(#clip0_173_70421)">
            <path
              id="Vector"
              d="M10.5867 6.195L7.99999 8.78167L5.41332 6.195C5.15332 5.935 4.73332 5.935 4.47332 6.195C4.21332 6.455 4.21332 6.875 4.47332 7.135L7.53332 10.195C7.79332 10.455 8.21332 10.455 8.47332 10.195L11.5333 7.135C11.7933 6.875 11.7933 6.455 11.5333 6.195C11.2733 5.94167 10.8467 5.935 10.5867 6.195Z"
              fill="#6D747A"
            />
          </g>
          <defs>
            <clipPath id="clip0_173_70421">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </header>
      <div
        style={{ maxWidth }}
        ref={dropdownRef}
        className={`${styles['options-container']} ${
          active ? styles['active'] : ''
        }`}
      >
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
              if (child.props.onClick) {
                child.props.onClick(event) // Call the original onClick function of the child
              }
              handleChildClick() // Call the handleChildClick function
            },
          })
        })}
      </div>
    </div>
  )
}

export default CommunityTopDropdown
