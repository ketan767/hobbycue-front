import React, { useEffect, useRef, useState } from 'react'
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
import { getAllListingCategories } from '@/services/listing.service'
import { isEmptyField } from '@/utils'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import {
  setCategory,
  setSearching,
  setSub_category,
} from '@/redux/slices/explore'
import { RootState } from '@/redux/store'

interface AccordianMenuProps {
  categoryValue: string
  handleSubmit: () => void
}
type DropdownListItem = {
  _id: string
  Description: string
  Show: string
  pageType: string
  listingCategory: string
}
const AccordionMenu2: React.FC<AccordianMenuProps> = ({
  categoryValue,
  handleSubmit,
}) => {
  const router = useRouter()
  // const { query } = router
  // const { sub_category } = query
  // const { category } = query
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openMenu, setOpenMenu] = useState(false)
  const [isPeopleOpened, setIsPeopleOpened] = useState(false)
  const [isPlaceOpened, setIsPlaceOpened] = useState(false)
  const [isProgramOpened, setIsProgramOpened] = useState(false)
  const [isProductOpened, setIsProductOpened] = useState(false)

  const [categoryIndex, setCategoryIndex] = useState<number>(-1)

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [isCategoryBoxOpened, setIsCategoryBoxOpened] = useState(false)
  const [categoryDropdownList, setCategoryDropdownList] = useState<
    DropdownListItem[]
  >([])
  const [filteredDropdownList, setFilteredDropdownList] =
    useState<DropdownListItem[]>(categoryDropdownList)
  const [peopleSubcategory, setPeopleSubcategory] =
    useState<DropdownListItem[]>(categoryDropdownList)
  const [placeSubcategory, setPlaceSubcategory] =
    useState<DropdownListItem[]>(categoryDropdownList)
  const [programSubcategory, setProgramSubcategory] =
    useState<DropdownListItem[]>(categoryDropdownList)
  const [productSubcategory, setProductSubcategory] =
    useState<DropdownListItem[]>(categoryDropdownList)
  // const [subCategory, setSubCategory] = useState('')
  const searchCategoryRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const { category: currCategory, sub_category } = useSelector(
    (state: RootState) => state.explore,
  )
  const [categoryInput, setCategoryInput] = useState('')

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
    setOpenMenu(true)
    setIsCategoryBoxOpened(!isCategoryBoxOpened)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setOpenMenu(false)
    setIsPeopleOpened(false)
    setIsPlaceOpened(false)
    setIsProgramOpened(false)
    setIsProductOpened(false)
  }

  const handleValueChange = (
    name?: string | undefined,
    subCategory?: string | undefined,
  ) => {
    if (subCategory) {
      //   setSubCategory({ value: subCategory, error: null })
      //   setValue({ value: '', error: null })

      // searchResult(undefined, undefined, subCategory)
      dispatch(setSub_category(subCategory))
      dispatch(setCategory(''))
    } else if (name) {
      //   setSubCategory({ value: '', error: null })
      // setCategoryValue(name)
      setCategoryInput(name)
      //   setValue({ value: name, error: null })
      // searchResult(name)
      dispatch(setSub_category(''))
      dispatch(setCategory(name))
    }
  }
  const handleCategoryInputChange = (e: any) => {
    setCategoryIndex(-1)
    // setCategoryValue(e.target.value)
    // setCategoryInput(e.target.value)

    // whille typing we always setting the subCategory
    dispatch(setSub_category(e.target.value))
    dispatch(setCategory(''))

    if (isEmptyField(e.target.value)) {
      // dispatch(setSearching(true))
      dispatch(setCategory(''))
      dispatch(setSub_category(''))
      return setFilteredDropdownList(categoryDropdownList)
    }

    const filteredCategories = categoryDropdownList.filter(
      (category) =>
        category.listingCategory
          .toLowerCase()
          .indexOf(e.target.value.toLowerCase()) !== -1,
    )
    setFilteredDropdownList(filteredCategories)
  }
  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // alert('Enter is pressed' + e.key)

    switch (e.key) {
      case 'ArrowDown':
        setCategoryIndex((prevIndex) =>
          prevIndex < filteredDropdownList.length - 1
            ? prevIndex + 1
            : prevIndex,
        )
        break
      case 'ArrowUp':
        setCategoryIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        )
        break
      case 'Enter':
        // e.stopPropagation()
        if (sub_category.length !== 0 && categoryIndex === -1) {
          //AddButtonRef.current?.click()
          handleSubmit()
        } else if (categoryIndex !== -1 && showCategoryDropdown) {
          setShowCategoryDropdown(false)
          // setCategoryValue(filteredDropdownList[categoryIndex].listingCategory)
          setCategoryInput(filteredDropdownList[categoryIndex].listingCategory)

          dispatch(
            setSub_category(
              filteredDropdownList[categoryIndex].listingCategory,
            ),
          )
          //   searchResult()
          handleSubmit()
        } else if (categoryIndex === -1 && sub_category.length === 0) {
          setShowCategoryDropdown(false)
          //   setValue({ value: '', error: null })

          // handleGenreInputFocus();
          // alert('Enter is pressed')
          //   searchResult('Empty')
          handleSubmit()
        }
        break
      default:
        break
    }

    // Scroll into view logic
    const container = searchCategoryRef.current
    const selectedItem = container?.children[categoryIndex] as HTMLElement

    if (selectedItem && container) {
      const containerRect = container.getBoundingClientRect()
      const itemRect = selectedItem.getBoundingClientRect()

      // Check if the item is out of view and adjust the scroll position
      if (itemRect.bottom + selectedItem.offsetHeight >= containerRect.bottom) {
        container.scrollTop +=
          itemRect.bottom - containerRect.bottom + selectedItem.offsetHeight + 5
      } else if (
        itemRect.top <=
        containerRect.top + selectedItem.offsetHeight
      ) {
        container.scrollTop -=
          containerRect.top - itemRect.top + selectedItem.offsetHeight + 5
      }
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const { err, res } = await getAllListingCategories()

      if (err) return console.log(err)

      const sortedCategories = res.data.data.sort((a: any, b: any) => {
        return a.listingCategory
          .toLowerCase()
          .localeCompare(b.listingCategory.toLowerCase())
      })

      const peoplesSubCat = sortedCategories.filter(
        (category: DropdownListItem) => category.pageType === 'People',
      )
      const placeSubCat = sortedCategories.filter(
        (category: DropdownListItem) => category.pageType === 'Place',
      )
      const programSubCat = sortedCategories.filter(
        (category: DropdownListItem) => category.pageType === 'Program',
      )
      const productSubCat = sortedCategories.filter(
        (category: DropdownListItem) => category.pageType === 'Product',
      )
      setPeopleSubcategory(peoplesSubCat)
      setPlaceSubcategory(placeSubCat)
      setProgramSubcategory(programSubCat)
      setProductSubcategory(productSubCat)
      setCategoryDropdownList(sortedCategories)
    }
    fetchCategories()
  }, [])
  return (
    <div className={styles.relative}>
      <div className={styles.relative}>
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
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              setShowCategoryDropdown(true)

              handleCategoryKeyDown(e)
              if (e.key === 'Enter') {
                handleSubmit()
              }
            }}
            value={currCategory ? currCategory : sub_category}
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
                fontSize: '14px',
                marginLeft: '-16px',
              },
              '& .MuiInputLabel-shrink': {
                marginTop: '3px',
                fontSize: '14px',
                marginLeft: '-16px',
              },
              '& .MuiInput-underline:hover:before': {
                borderBottomColor: '#7F63A1 !important',
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

          {showCategoryDropdown && filteredDropdownList.length !== 0 && (
            <div className={styles.dropdownCategory} ref={searchCategoryRef}>
              {filteredDropdownList.map((category, index) => {
                return (
                  <p
                    key={category._id}
                    onClick={() => {
                      // setCategoryValue(category.listingCategory)
                      setCategoryInput(category.listingCategory)
                      //   setValue({ value: '', error: null })

                      // searchResult(
                      //   undefined,
                      //   undefined,
                      //   category.listingCategory,
                      // )
                      dispatch(setSub_category(category.listingCategory))
                      dispatch(setCategory(''))
                    }}
                    className={
                      index === categoryIndex
                        ? styles['dropdown-option-focus']
                        : ''
                    }
                  >
                    {category.listingCategory}
                  </p>
                )
              })}
            </div>
          )}
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
          maxHeight: '47vh',
        }}
      >
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
            {peopleSubcategory &&
              peopleSubcategory.length > 0 &&
              peopleSubcategory.map((subcategory, index) => {
                if (index === peopleSubcategory.length - 1) {
                  return (
                    <>
                      <MenuItem
                        onClick={() => {
                          setIsPeopleOpened(false)
                          setIsPlaceOpened(false)
                          setIsProgramOpened(false)
                          setIsProductOpened(false)
                          // setCategoryValue(subcategory.listingCategory)
                          setCategoryInput(subcategory.listingCategory)
                          handleClose()
                          //   setValue({ value: '', error: null })

                          handleValueChange(
                            undefined,
                            subcategory.listingCategory,
                          )
                        }}
                        sx={{
                          marginLeft: '-16px',
                          marginBottom: '-11px',
                        }}
                        className={styles.pOptions}
                      >
                        {subcategory.listingCategory}
                      </MenuItem>
                    </>
                  )
                }
                return (
                  <>
                    <MenuItem
                      onClick={() => {
                        setIsPeopleOpened(false)
                        setIsPlaceOpened(false)
                        setIsProgramOpened(false)
                        setIsProductOpened(false)
                        // setCategoryValue(subcategory.listingCategory)
                        setCategoryInput(subcategory.listingCategory)
                        handleClose()
                        // setValue({ value: '', error: null })

                        handleValueChange(
                          undefined,
                          subcategory.listingCategory,
                        )
                      }}
                      sx={{
                        marginLeft: '-16px',
                        marginBottom: '11px',
                      }}
                      className={styles.pOptions}
                    >
                      {subcategory.listingCategory}
                    </MenuItem>
                  </>
                )
              })}
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
            {placeSubcategory &&
              placeSubcategory.length > 0 &&
              placeSubcategory.map((subcategory, index) => {
                if (index === placeSubcategory.length - 1) {
                  return (
                    <>
                      <MenuItem
                        onClick={() => {
                          setIsPeopleOpened(false)
                          setIsPlaceOpened(false)
                          setIsProgramOpened(false)
                          setIsProductOpened(false)
                          // setCategoryValue(subcategory.listingCategory)
                          setCategoryInput(subcategory.listingCategory)
                          handleClose()
                          //   setValue({ value: '', error: null })

                          handleValueChange(
                            undefined,
                            subcategory.listingCategory,
                          )
                        }}
                        sx={{
                          marginLeft: '-16px',
                          marginBottom: '-11px',
                        }}
                        className={styles.pOptions}
                      >
                        {subcategory.listingCategory}
                      </MenuItem>
                    </>
                  )
                }
                return (
                  <>
                    <MenuItem
                      onClick={() => {
                        setIsPeopleOpened(false)
                        setIsPlaceOpened(false)
                        setIsProgramOpened(false)
                        setIsProductOpened(false)
                        // setCategoryValue(subcategory.listingCategory)
                        setCategoryInput(subcategory.listingCategory)
                        handleClose()
                        // setValue({ value: '', error: null })

                        handleValueChange(
                          undefined,
                          subcategory.listingCategory,
                        )
                      }}
                      sx={{
                        marginLeft: '-16px',
                        marginBottom: '11px',
                      }}
                      className={styles.pOptions}
                    >
                      {subcategory.listingCategory}
                    </MenuItem>
                  </>
                )
              })}
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
            {programSubcategory &&
              programSubcategory.length > 0 &&
              programSubcategory.map((subcategory, index) => {
                if (index === programSubcategory.length - 1) {
                  return (
                    <>
                      <MenuItem
                        onClick={() => {
                          setIsPeopleOpened(false)
                          setIsPlaceOpened(false)
                          setIsProgramOpened(false)
                          setIsProductOpened(false)
                          // setCategoryValue(subcategory.listingCategory)
                          setCategoryInput(subcategory.listingCategory)
                          handleClose()
                          //   setValue({ value: '', error: null })

                          handleValueChange(
                            undefined,
                            subcategory.listingCategory,
                          )
                        }}
                        sx={{
                          marginLeft: '-16px',
                          marginBottom: '-11px',
                        }}
                        className={styles.pOptions}
                      >
                        {subcategory.listingCategory}
                      </MenuItem>
                    </>
                  )
                }
                return (
                  <>
                    <MenuItem
                      onClick={() => {
                        setIsPeopleOpened(false)
                        setIsPlaceOpened(false)
                        setIsProgramOpened(false)
                        setIsProductOpened(false)
                        // setCategoryValue(subcategory.listingCategory)
                        setCategoryInput(subcategory.listingCategory)
                        // setValue({ value: '', error: null })

                        handleClose()
                        handleValueChange(
                          undefined,
                          subcategory.listingCategory,
                        )
                      }}
                      sx={{
                        marginLeft: '-16px',
                        marginBottom: '11px',
                      }}
                      className={styles.pOptions}
                    >
                      {subcategory.listingCategory}
                    </MenuItem>
                  </>
                )
              })}
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
            {productSubcategory &&
              productSubcategory.length > 0 &&
              productSubcategory.map((subcategory, index) => {
                if (index === productSubcategory.length - 1) {
                  return (
                    <>
                      <MenuItem
                        onClick={() => {
                          setIsPeopleOpened(false)
                          setIsPlaceOpened(false)
                          setIsProgramOpened(false)
                          setIsProductOpened(false)
                          // setCategoryValue(subcategory.listingCategory)
                          setCategoryInput(subcategory.listingCategory)
                          //   setValue({ value: '', error: null })
                          handleClose()
                          handleValueChange(
                            undefined,
                            subcategory.listingCategory,
                          )
                        }}
                        sx={{
                          marginLeft: '-16px',
                          marginBottom: '-11px',
                        }}
                        className={styles.pOptions}
                      >
                        {subcategory.listingCategory}
                      </MenuItem>
                    </>
                  )
                }
                return (
                  <>
                    <MenuItem
                      onClick={() => {
                        setIsPeopleOpened(false)
                        setIsPlaceOpened(false)
                        setIsProgramOpened(false)
                        setIsProductOpened(false)
                        // setCategoryValue(subcategory.listingCategory)
                        setCategoryInput(subcategory.listingCategory)
                        // setValue({ value: '', error: null })

                        handleClose()
                        handleValueChange(
                          undefined,
                          subcategory.listingCategory,
                        )
                      }}
                      sx={{
                        marginLeft: '-16px',
                        marginBottom: '11px',
                      }}
                      className={styles.pOptions}
                    >
                      {subcategory.listingCategory}
                    </MenuItem>
                  </>
                )
              })}
          </AccordionDetails>
        </Accordion>
      </Menu>
    </div>
  )
}

export default AccordionMenu2
