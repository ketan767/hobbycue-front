import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import {
  addUserAddress,
  getMyProfileDetail,
  updateUserAddress,
} from '@/services/user.service'
import {
  containOnlyNumbers,
  isEmpty,
  isEmptyField,
  validatePhone,
  validateUrl,
} from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import Checkbox from '@mui/material/Checkbox'
import { listingTypes } from '@/constants/constant'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

const ListingCopyModal: React.FC<Props> = ({ onComplete, onBackBtnClick }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, SetBackDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [tick, setTick] = useState(false)

  return <></>
}

export default ListingCopyModal
