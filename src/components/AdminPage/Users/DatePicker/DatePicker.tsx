import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import styles from './DatrePicker.module.css'
import 'react-datepicker/dist/react-datepicker.css'

interface Props {
  handleDatePick?: (date: Date) => void // Callback for date selection
  updateState: () => void // Function to update state after date is picked
}

const MyDatePicker: React.FC<Props> = ({ handleDatePick, updateState }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date()) // Allow null to handle cleared dates

  const handleDateChange = (date: Date | null) => {
    setStartDate(date) // Update state with the new date
    if (date) {
      handleDatePick?.(date) // Call the parent callback with the selected date
      updateState() // Call the parent function to update state
    }
  }

  return (
    <div className={styles.container}>
      <DatePicker
        selected={startDate}
        onChange={(date) => handleDateChange(date as Date | null)} // Ensure type safety
        inline
      />
    </div>
  )
}

export default MyDatePicker
