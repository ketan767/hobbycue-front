import React, { useState, useRef, useEffect } from 'react';
import styles from './select.module.css';
import DefaultPageImage from '@/assets/svg/default-images/default-people-listing-icon.svg';

type Props = {
  options?: any[];
  onChange?: (selectedValues: any[]) => void;
  value: any[];
  children: any;
  className?: string;
  selectText?: string;
  optionsContainerClass?: string;
  optionsContainerUnactiveClass?: string;
  type?: 'page';
  img?: string;
};

const MultipleSelect: React.FC<Props> = ({
  options = [],
  onChange,
  value = [],
  children,
  className,
  selectText,
  optionsContainerClass,
  optionsContainerUnactiveClass,
  type,
  img,
}) => {
  const [active, setActive] = useState(false);
  const toggle = () => setActive(!active);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setActive(false);
      }
    };

    if (active) {
      document.addEventListener('click', closeDropdown);
    } else {
      document.removeEventListener('click', closeDropdown);
    }

    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, [active]);

  const handleHeaderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    toggle();
  };

  const handleOptionClick = (option: any) => {
    const isSelected = value.includes(option);
    const updatedValues = isSelected
      ? value.filter((item) => item !== option) // Remove option
      : [...value, option]; // Add option

    onChange?.(updatedValues);
  };

  return (
    <div className={`${styles.container} ${className ? className : ''}`}>
      <header className={styles.header} onClick={handleHeaderClick}>
        {type === 'page' ? (
          <div className={styles['page-type']}>
            {value.length > 0 && (
              <img src={img ?? DefaultPageImage.src} alt="Selected" />
            )}
            <p>{value.length > 0 ? value.join(', ') : selectText ?? 'Select...'}</p>
          </div>
        ) : (
          <p>{value.length > 0 ? value.join(', ') : selectText ?? 'Select...'}</p>
        )}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ rotate: active ? '180deg' : '0deg' }}
        >
          <path
            d="M10.5867 6.195L7.99999 8.78167L5.41332 6.195C5.15332 5.935 4.73332 5.935 4.47332 6.195C4.21332 6.455 4.21332 6.875 4.47332 7.135L7.53332 10.195C7.79332 10.455 8.21332 10.455 8.47332 10.195L11.5333 7.135C11.7933 6.875 11.7933 6.455 11.5333 6.195C11.2733 5.94167 10.8467 5.935 10.5867 6.195Z"
            fill="#6D747A"
          />
        </svg>
      </header>
      <div
        ref={dropdownRef}
        className={`${styles['options-container']} ${
          active ? styles['active'] : ''
        }
        ${optionsContainerUnactiveClass ?? ''}
        ${active ? optionsContainerClass ?? '' : ''} 
        ${className ? className : ''}`}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className={`${styles.option} ${
              value.includes(option) ? styles.selected : ''
            }`}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleSelect;