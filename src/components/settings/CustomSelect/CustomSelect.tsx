import { useState, useRef, useEffect } from "react";
import styles from "./CustomSelect.module.css";

interface CustomSelectProps {
  options: string[]; 
  onChange?: (selected: string) => void;
  value ?: string; 
}

export default function CustomSelect({ options, onChange,value }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>(value||options[0]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    if (onChange) onChange(option); 
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.customSelect} ref={dropdownRef}>
      <div className={styles.selectBox} onClick={toggleDropdown}>
        <span className={styles.selected}>{selected}</span>
      </div>
      {isOpen && (
        <div className={styles.optionsContainer}>
          {options.map((option, index) => (
            <div
              key={index}
              className={styles.option}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
