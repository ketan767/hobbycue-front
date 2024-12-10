import React, { useEffect, useState } from 'react'
import styles from '../styles.module.css'
import HobbyField from '../FilterComponents/HobbyField'
import LocationField from '../FilterComponents/LocationField'
import { isMobile } from '@/utils'
import useHandleSubmit from '../utils/HandleSubmit'
import AccordionMenu2 from '@/pages/explore/nestedDropdown/AccordionMenu2'
import AccordionMenu3 from '@/pages/explore/nestedDropdown/AccordianMenu3'
import { useDispatch } from 'react-redux'
import {
  setCategory,
  setHobby,
  setLocation,
  setPageType,
} from '@/redux/slices/explore'

type PExploreProps = {
  categoryValue: string
  setCategoryValue: (cat: string) => void
}
const PExplore: React.FC<PExploreProps> = ({
  categoryValue,
  setCategoryValue,
}) => {
  const isMob = isMobile()
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
    <div className={styles.siteExploreParent}>
      <div className={styles.inputExploreContainer}>
        <HobbyField
          selectedCategory={selectedCategory ? selectedCategory : categoryValue}
          selectedPageType={selectedPageType}
          selectedLocation={selectedLocation}
          selectedHobby={selectedHobby}
          setSelectedHobby={setSelectedHobby}
        />
        <div className={styles.accordianPosition}>
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
          selectedCategory={selectedCategory ? selectedCategory : categoryValue}
          selectedPageType={selectedPageType}
          selectedHobby={selectedHobby}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />

        <button
          className="modal-footer-btn"
          style={{
            width: isMob ? '100%' : 71,
            height: 32,
            marginLeft: 'auto',
          }}
          onClick={() =>
            handleSubmit(
              selectedCategory ? selectedCategory : categoryValue,
              selectedPageType,
              selectedHobby,
              selectedLocation,
            )
          }
        >
          Explore
        </button>
      </div>
    </div>
  )
}

export default PExplore
