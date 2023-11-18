import React, { useEffect, useRef, useState } from 'react'
import styles from './input.module.css'
import ExpandMoreSharpIcon from '@mui/icons-material/ExpandMoreSharp'
type Props = {
  options: any
  onChange?: any
  value?: any
  name?: any
}

const InputSelect: React.FC<Props> = ({ options, onChange, value, name }) => {
  const [displayDropdown, setDisplayDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [focusedElement, setFocusedElement] = useState(null)
  const elementRef = useRef(null)

  useEffect(() => {        
    const handleClick = (e: any) => {
      console.log(e.target?.['id'])
      if (
        e.target?.['id'] === 'input-display' ||
        e.target?.['id'] === 'input-display-text'||
        e.target?.['id'] === 'input-display-icon'
      ) {
        console.log('test-1',displayDropdown)
      } else {
        console.log('test-2',displayDropdown)
        if (displayDropdown) setDisplayDropdown(false)
        document.removeEventListener('click', handleClick)
      }
    }


    
    if (displayDropdown) {
      document.addEventListener('click', handleClick)
    }
    else{
      document.removeEventListener('click', handleClick)
    }
  }, [displayDropdown])

  // useEffect(() => {
  //   const handleKeydown = (event: any) => {
  //     if (focusedElement?.['id'] === 'input-display') {
  //       setFocusedElement(null)
  //     }
  //   }

  //   const handleClick = (e: any) => {
  //     console.log(focusedElement)
  //     if (e.target !== focusedElement) {
  //       setDisplayDropdown((prevValue) => !prevValue)

  //       setFocusedElement(null)
  //     }
  //   }

  //   if (focusedElement !== null && typeof focusedElement !== 'undefined') {
  //     document.addEventListener('click', handleClick)
  //   }
  //   return () => {
  //     document.removeEventListener('click', handleClick)
  //   }
  // }, [focusedElement])

  // const handleKeyDown = (event: any) => {
  //   console.log(event)

  //   switch (event.key) {
  //     case 'ArrowUp':
  //       setFocusedIndex((prevIndex) => Math.max(0, prevIndex - 1));
  //       break;
  //     case 'ArrowDown':
  //       setFocusedIndex((prevIndex) => Math.min(options.length - 1, prevIndex + 1));
  //       break;
  //     case 'Enter':
  //       if (focusedIndex !== -1) {
  //         // Do something with the selected option
  //         console.log('Selected:', options[focusedIndex]);
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // useEffect(() => {
  //   const handleFocus = () => {
  //     setFocusedIndex(-1);
  //   };

  //   document.addEventListener('focus', handleFocus, true);

  //   // return () => {
  //   //   document.removeEventListener('focus', handleFocus, true);
  //   // };
  // }, []);

  // const ulElement = document.getElementById('input-display')
  // if (ulElement?.getBoundingClientRect() !== undefined) {
  //   // console.log(ulElement?.getBoundingClientRect(), name)
  // }

  const handleDisplayDropdown = () => {
    setDisplayDropdown((prevValue) => !prevValue)
  }

  return (
    <div className={styles['input-select-wrapper']}>
      <div
        ref={elementRef}
        id="input-display"
        className={styles['input-select-display']}
        onClick={() => {
          handleDisplayDropdown()
          setFocusedElement(elementRef.current)
        }}
      >
        <p id="input-display-text">{value}</p>
        <ExpandMoreSharpIcon id={'input-display-icon'}/>
      </div>
      <ul
        id="input-ul"
        style={{ display: displayDropdown ? 'initial' : 'none' }}
      >
        {options.map((item: any, index: number) => (
          <li
            key={index}
            onClick={(event: React.MouseEvent<HTMLLIElement>) => {
              const textContent = event.currentTarget.textContent
              setDisplayDropdown(!displayDropdown)
              setActiveIndex(index)
              console.log(index, activeIndex)
              onChange({ value: textContent, name: name })
            }}
            className={activeIndex === index ? styles['option-active'] : ''}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default InputSelect
