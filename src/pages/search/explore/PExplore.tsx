import React, { useEffect, useState } from 'react'
import styles from '../styles.module.css'
import HobbyField from '../FilterComponents/HobbyField'
import LocationField from '../FilterComponents/LocationField'
import useHandleSubmit from '../utils/HandleSubmit'
import AccordionMenu3 from '@/pages/explore/nestedDropdown/AccordianMenu3'
import { useDispatch } from 'react-redux'
import {
  setCategory,
  setHobby,
  setLocation,
  setPageType,
} from '@/redux/slices/explore'
import SubmitButton from './buttons/explore/SubmitButton'

type PExploreProps = {
  categoryValue: string
  setCategoryValue: (cat: string) => void
}
const PExplore: React.FC<PExploreProps> = ({
  categoryValue,
  setCategoryValue,
}) => {
  const handleSubmit = useHandleSubmit()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPageType, setSelectedPageType] = useState('')
  const [selectedHobby, setSelectedHobby] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setHobby(''))
    dispatch(setLocation(''))
    dispatch(setPageType(''))
    dispatch(setCategory(''))
  }, [])
  return (
    <>
      <div className={styles.siteExploreParent}>
        <div className={styles.inputExploreContainer}>
          <HobbyField
            selectedCategory={
              selectedCategory ? selectedCategory : categoryValue
            }
            selectedPageType={selectedPageType}
            selectedLocation={selectedLocation}
            selectedHobby={selectedHobby}
            setSelectedHobby={setSelectedHobby}
          />
          <div className={`${styles.accordianPosition} ${styles.mobileHidden}`}>
            <AccordionMenu3
              defaultCategory={categoryValue}
              setDefaultCategory={setCategoryValue}
              selectedCategory={selectedCategory}
              selectedPageType={selectedPageType}
              setSelectedCategory={setSelectedCategory}
              setSelectedPageType={setSelectedPageType}
              selectedHobby={selectedHobby}
              selectedLocation={selectedLocation}
              handleSubmit={handleSubmit}
            />
          </div>

          <LocationField
            selectedCategory={
              selectedCategory ? selectedCategory : categoryValue
            }
            selectedPageType={selectedPageType}
            selectedHobby={selectedHobby}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />

          <div className={styles.mobileHidden}>
            <SubmitButton
              selectedCategory={
                selectedCategory ? selectedCategory : categoryValue
              }
              selectedPageType={selectedPageType}
              selectedHobby={selectedHobby}
              selectedLocation={selectedLocation}
            />
          </div>
        </div>
      </div>
      <div className={`${styles.siteExploreParent} ${styles.laptopHidden}`}>
        <div
          className={`${styles.inputExploreContainer} ${styles.inputExploreContainerWithBtn}`}
        >
          <div
            className={`${styles.accordianPosition} ${styles.accordianPositionMobile}`}
          >
            <AccordionMenu3
              defaultCategory={categoryValue}
              setDefaultCategory={setCategoryValue}
              selectedCategory={selectedCategory}
              selectedPageType={selectedPageType}
              setSelectedCategory={setSelectedCategory}
              setSelectedPageType={setSelectedPageType}
              selectedHobby={selectedHobby}
              selectedLocation={selectedLocation}
              handleSubmit={handleSubmit}
            />
          </div>

          <div className={`${styles.submitMobile}`}>
            <SubmitButton
              selectedCategory={
                selectedCategory ? selectedCategory : categoryValue
              }
              selectedPageType={selectedPageType}
              selectedHobby={selectedHobby}
              selectedLocation={selectedLocation}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default PExplore
