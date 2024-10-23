import React, { useState } from 'react'
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
  // const [subCategory, setSubCategory] = useState('')

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
    setOpenMenu(true)
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

  return (
    <div className={styles.relative}>
      <div className={styles.dropdown} onClick={handleClick}>
        <Image src={SearchIcon} width={16} height={16} alt="SearchIcon" />
        <span className={styles.value}>{value ? value : subCategory}</span>
        <Image src={Dropdown} width={16} height={16} alt="Dropdown" />
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
          top: '0px',
        }}
      >
        {/* Regular Menu Item */}
        <MenuItem
          onClick={() => {
            handleClose()
            handleValueChange('All')
          }}
        >
          All
        </MenuItem>

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
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            tabIndex={-1}
            sx={{ margin: 0, padding: 0 }}
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
                  className={isPeopleOpened ? `${styles.peopleOpened}` : ''}
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
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            tabIndex={-1}
            sx={{ margin: 0, padding: 0 }}
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
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
            tabIndex={-1}
            sx={{ margin: 0, padding: 0 }}
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
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            tabIndex={-1}
            sx={{ margin: 0, padding: 0 }}
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
