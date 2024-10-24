import React, { useRef, useState } from 'react'
import {
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@/assets/svg/search.svg'
import Dropdown from '@/assets/svg/exploreSearch/Down.svg'
import PeopleIcon from '@/assets/svg/People.svg'
import PlaceIcon from '@/assets/svg/Place.svg'
import ProgramIcon from '@/assets/svg/Program.svg'
import ProductIcon from '@/assets/svg/Search/Product2.svg'
import Image from 'next/image'
import styles from './AccordianMenu.module.css'
import { getAllListingPageTypes } from '@/services/listing.service'

interface AccordianMenuProps {
  value: string
  setValue: React.Dispatch<React.SetStateAction<{ value: string; error: null }>>
  subCategory: string
  setSubCategory: React.Dispatch<
    React.SetStateAction<{ value: string; error: null }>
  >
  searchResult: Function
}
const AccordionMenu: React.FC<AccordianMenuProps> = ({
  value,
  setValue,
  subCategory,
  setSubCategory,
  searchResult,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openMenu, setOpenMenu] = useState(false)
  const [isPeopleOpened, setIsPeopleOpened] = useState(false)
  const [isPlaceOpened, setIsPlaceOpened] = useState(false)
  const [isProgramOpened, setIsProgramOpened] = useState(false)
  const [isProductOpened, setIsProductOpened] = useState(false)
  const [categoryValue, setCategoryValue] = useState('')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [isCategoryBoxOpened, setIsCategoryBoxOpened] = useState(false)

  // const [subCategory, setSubCategory] = useState('')
  const searchCategoryRef = useRef()

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
    setOpenMenu(true)
    setIsCategoryBoxOpened(!isCategoryBoxOpened)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setOpenMenu(false)
    setIsPeopleOpened(false)
  }

  const handleValueChange = (
    name?: string | undefined,
    subCategory?: string | undefined,
  ) => {
    if (subCategory) {
      setSubCategory({ value: subCategory, error: null })
      setValue({ value: '', error: null })
      searchResult(undefined, undefined, subCategory)
    } else if (name) {
      setSubCategory({ value: '', error: null })
      setValue({ value: name, error: null })
      searchResult(name)
      // alert(name)
    }
  }
  const handleCategoryInputChange = async (e: any) => {}
  // const handleCategoryInputChange = async (e: any) => {
  //   setCategoryValue(e.target.value)
  //   if (e.target.value === '') {
  //     setFilterData((prev) => ({ ...prev, hobby: '' }))
  //   }
  //   if (isEmptyField(e.target.value)) return setHobbyDropdownList([])

  //   const query = `fields=display,genre&level=5&level=3&level=2&search=${e.target.value}`
  //   const { err, res } = await getAllListingPageTypes(query)

  //   if (err) return console.log(err)

  //   // Modify the sorting logic to prioritize items where the search keyword appears at the beginning
  //   const sortedHobbies = res.data.hobbies.sort((a: any, b: any) => {
  //     const indexA = a.display
  //       .toLowerCase()
  //       .indexOf(e.target.value.toLowerCase())
  //     const indexB = b.display
  //       .toLowerCase()
  //       .indexOf(e.target.value.toLowerCase())

  //     if (indexA === 0 && indexB !== 0) {
  //       return -1
  //     } else if (indexB === 0 && indexA !== 0) {
  //       return 1
  //     }

  //     return a.display.toLowerCase().localeCompare(b.display.toLowerCase())
  //   })
  //   // setData((prev) => {
  //   //   return { ...prev, hobby: null }
  //   // })
  //   setHobbyDropdownList(sortedHobbies)
  // }
  return (
    <div className={styles.relative}>
      <div className={styles.relative}>
        {/* <Image src={SearchIcon} width={16} height={16} alt="SearchIcon" /> */}
        {/* <span className={styles.value}>{value ? value : subCategory}</span> */}
        <div className={styles.categorySuggestion}>
          <Image
            src={SearchIcon}
            width={16}
            height={16}
            alt="SearchIcon"
            className={styles.searchIcon}
          />
          <TextField
            autoComplete="off"
            inputRef={searchCategoryRef}
            variant="standard"
            label="Category"
            size="small"
            name="Category"
            className={styles.dropdown}
            onFocus={() => {
              setShowCategoryDropdown(true)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setShowCategoryDropdown(false)
                searchResult()
              }
            }}
            value={categoryValue}
            onBlur={() =>
              setTimeout(() => {
                setShowCategoryDropdown(false)
              }, 300)
            }
            onChange={handleCategoryInputChange}
            sx={{
              '& label': {
                fontSize: '16px',
                paddingLeft: '24px',
              },
              '& label.Mui-focused': {
                fontSize: '12px',
                marginLeft: '-16px',
              },
              '& .MuiInputLabel-shrink': {
                fontSize: '12px',
                marginLeft: '-16px',
              },
              '& .MuiInput-underline:hover:before': {
                borderBottomColor: '#7F63A1',
              },
            }}
            InputProps={{
              sx: {
                paddingLeft: '24px',
              },
            }}
          />
          <Image
            src={Dropdown}
            width={16}
            height={16}
            alt="Dropdown"
            onClick={handleClick}
            className={`${styles.arrow} ${
              openMenu ? `${styles.arrowRotated}` : ''
            }`}
          />

          {/* {showCategoryDropdown && hobbyDropdownList.length !== 0 && (
          <div className={styles.dropdownHobby}>
            {hobbyDropdownList.map((hobby) => {
              return (
                <p
                  key={hobby._id}
                  onClick={() => {
                    setData((prev) => ({
                      ...prev,
                      hobby: { value: hobby.display, error: null },
                    }))

                    console.warn({ hobby })
                    setHobbyInputValue(hobby.display)
                    setFilterData((prev) => ({
                      category: hobby.category?._id ?? prev.category,
                      subCategory: hobby.sub_category?._id ?? prev.subCategory,
                      hobby: hobby._id,
                    }))
                    searchResult(undefined, hobby.display)
                  }}
                >
                  {hobby.display}
                </p>
              )
            })}
          </div>
        )} */}
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        sx={{
          '&:before': { display: 'none' },
          width: '300px',
          margin: '0',
          padding: '0',
          position: 'absolute',
          top: '8px',
          left: '-144px',
        }}
      >
        {/* Regular Menu Item */}
        {/* <MenuItem
          onClick={() => {
            handleClose()
            handleValueChange('All')
          }}
        >
          All
        </MenuItem> */}

        {/* Accordion Inside Menu */}
        <Accordion
          disableGutters
          elevation={0}
          square
          sx={{
            '&:before': { display: 'none' },
            width: '100%',
            margin: '0',
            padding: '0',
          }}
          expanded={isPeopleOpened}
          onChange={() => {
            setIsPeopleOpened(!isPeopleOpened)
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{ fontSize: '16px' }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            tabIndex={-1}
            sx={{ margin: 0, padding: '0 10px 0 0' }}
          >
            <Typography sx={{ marginLeft: '16px' }}>
              <div className={styles.pContainer}>
                <Image
                  src={PeopleIcon}
                  width={16}
                  height={16}
                  alt="PeopleIcon"
                />
                <span
                  className={`${styles.categoryName} ${
                    isPeopleOpened ? `${styles.peopleOpened}` : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleValueChange('People')
                    handleClose()
                  }}
                >
                  People
                </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MenuItem
              onClick={() => {
                handleClose()
                handleValueChange(undefined, 'Teacher')
              }}
              sx={{
                marginLeft: '-16px',
                marginBottom: '11px',
              }}
              className={styles.pOptions}
            >
              Teacher
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose()
                handleValueChange(undefined, 'Coach')
              }}
              sx={{
                marginLeft: '-16px',
                marginTop: '11px',
                marginBottom: '11px',
              }}
              className={styles.pOptions}
            >
              Coach
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose()
                handleValueChange(undefined, 'Artist')
              }}
              sx={{
                marginLeft: '-16px',
                marginTop: '11px',
                marginBottom: '11px',
              }}
              className={styles.pOptions}
            >
              Artist
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose()
                handleValueChange(undefined, 'Expert')
              }}
              sx={{
                marginLeft: '-16px',
                marginTop: '11px',
                marginBottom: '11px',
              }}
              className={styles.pOptions}
            >
              Expert
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose()
                handleValueChange(undefined, 'Collaborator')
              }}
              sx={{
                marginLeft: '-16px',
                marginTop: '11px',
                marginBottom: '11px',
              }}
              className={styles.pOptions}
            >
              Collaborator
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose()
                handleValueChange(undefined, 'Organisation')
              }}
              sx={{
                marginLeft: '-16px',
                marginTop: '11px',
                marginBottom: '11px',
              }}
              className={styles.pOptions}
            >
              Organisation
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose()
                handleValueChange(undefined, 'Association')
              }}
              sx={{
                marginLeft: '-16px',
                marginTop: '11px',
              }}
              className={styles.pOptions}
            >
              Association
            </MenuItem>
          </AccordionDetails>
        </Accordion>
        <Accordion
          disableGutters
          elevation={0}
          square
          sx={{
            '&:before': { display: 'none' },
            width: '100%',
            margin: '0',
            padding: '0',
          }}
          expanded={isPlaceOpened}
          onChange={() => {
            setIsPlaceOpened(!isPlaceOpened)
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{ fontSize: '16px' }} />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            tabIndex={-1}
            sx={{ margin: 0, padding: '0 10px 0 0' }}
          >
            <Typography sx={{ marginLeft: '16px' }}>
              <div className={styles.pContainer}>
                <Image src={PlaceIcon} width={16} height={16} alt="PlaceIcon" />
                <span
                  className={isPlaceOpened ? `${styles.placeOpened}` : ''}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleValueChange('Place')
                    handleClose()
                  }}
                >
                  Place
                </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MenuItem
              onClick={() => {
                handleClose()
                handleValueChange('Teacher')
              }}
              sx={{
                marginLeft: '-16px',
                marginBottom: '11px',
              }}
              className={styles.pOptions}
            >
              Teacher
            </MenuItem>
          </AccordionDetails>
        </Accordion>
        <Accordion
          disableGutters
          elevation={0}
          square
          sx={{
            '&:before': { display: 'none' },
            width: '100%',
            margin: '0',
            padding: '0',
          }}
          expanded={isProgramOpened}
          onChange={() => {
            setIsProgramOpened(!isProgramOpened)
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{ fontSize: '16px' }} />}
            aria-controls="panel3a-content"
            id="panel3a-header"
            tabIndex={-1}
            sx={{ margin: 0, padding: '0 10px 0 0' }}
          >
            <Typography sx={{ marginLeft: '16px' }}>
              <div className={styles.pContainer}>
                <Image
                  src={ProgramIcon}
                  width={16}
                  height={16}
                  alt="ProgramIcon"
                />
                <span
                  className={isProgramOpened ? `${styles.programOpened}` : ''}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleValueChange('Program')
                    handleClose()
                  }}
                >
                  Program
                </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MenuItem
              onClick={() => {
                handleClose()
                handleValueChange('Teacher')
              }}
              sx={{
                marginLeft: '-16px',
                marginBottom: '11px',
              }}
              className={styles.pOptions}
            >
              Teacher
            </MenuItem>
          </AccordionDetails>
        </Accordion>
        <Accordion
          disableGutters
          elevation={0}
          square
          sx={{
            '&:before': { display: 'none' },
            width: '100%',
            margin: '0',
            padding: '0',
          }}
          expanded={isProductOpened}
          onChange={() => {
            setIsProductOpened(!isProductOpened)
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{ fontSize: '16px' }} />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            tabIndex={-1}
            sx={{ margin: 0, padding: '0 10px 0 0' }}
          >
            <Typography sx={{ marginLeft: '16px' }}>
              <div className={styles.pContainer}>
                <Image
                  src={ProductIcon}
                  width={16}
                  height={16}
                  alt="ProductIcon"
                />
                <span
                  className={isProductOpened ? `${styles.productOpened}` : ''}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleValueChange('Product')
                    handleClose()
                  }}
                >
                  Product
                </span>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MenuItem
              onClick={() => {
                handleClose()
                handleValueChange('Teacher')
              }}
              sx={{
                marginLeft: '-16px',
                marginBottom: '11px',
              }}
              className={styles.pOptions}
            >
              Teacher
            </MenuItem>
          </AccordionDetails>
        </Accordion>
      </Menu>
    </div>
  )
}

export default AccordionMenu
