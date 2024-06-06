import React, { useState, useEffect, useRef } from 'react'
import styles from './style.module.css'
import { CircularProgress, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import Image from 'next/image'
import {
  addProductVariant,
  getProductVariant,
  purchaseProduct,
  updateProductVariant,
} from '@/services/listing.service'
import CloseIcon from '@/assets/icons/CloseIcon'
import NextIcon from '@/assets/svg/Next.svg'
import hcLogo from '@/assets/image/logo-full.png'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import InputSelect from '@/components/InputSelect/inputSelect'
import { formatPrice } from '@/utils'
import rupeesIcon from '@/assets/svg/rupees.svg'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  onStatusChange?: (isChanged: boolean) => void
  onBoarding?: boolean
  propData?: any
}

const ListingProductPurchase: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  onBoarding,
  propData,
}) => {
  console.log({ propData })
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const { listingModalData } = useSelector((state: RootState) => state.site)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  console.log('listingModalData:', listingModalData)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [data, setData] = useState<{
    _id?: string
    variant_tag: string
    variations: { name: string; value: string; quantity: number }[]
  }>({ variant_tag: '', variations: [] })
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  useEffect(() => {
    if (propData && propData.currentListing && propData.currentListing._id) {
      getProductVariant(propData.currentListing._id)
        .then((result) => {
          if (result.res && result.res.data && result.res.data.data) {
            if (result.res?.data?.data.variations)
              setData({
                ...result.res?.data?.data,
                variations: result.res?.data?.data.variations.map(
                  (obj: any) => ({ ...obj, quantity: 0 }),
                ),
              })
            else {
              setData({ ...result.res?.data?.data, variations: [] })
            }
            // console.log(result.res)
          } else if (result.err) {
            console.log({ err: result.err })
          }
        })
        .catch((err) => {
          console.log({ err })
        })
    }
  }, [propData])

  const handleSubmit = async () => {
    const apiFunc = purchaseProduct
    setSubmitBtnLoading(true)
    const { err, res } = await apiFunc(data._id as string, {
      ...data,
    })
    if (err) {
      return setSnackbar({
        display: true,
        type: 'warning',
        message: 'Some error occured during purchase',
      })
    }
    console.log('res', res?.data.data.listing)

    if (onComplete) onComplete()
    else {
      setSnackbar({
        display: true,
        type: 'success',
        message: 'Purchased Successfully',
      })
      setTimeout(() => {
        dispatch(closeModal())
      }, 2000)
    }
  }

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)

  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clip-path="url(#clip0_14513_208561)">
        <path
          d="M13.1429 8.85714H8.85714V13.1429C8.85714 13.6143 8.47143 14 8 14C7.52857 14 7.14286 13.6143 7.14286 13.1429V8.85714H2.85714C2.38571 8.85714 2 8.47143 2 8C2 7.52857 2.38571 7.14286 2.85714 7.14286H7.14286V2.85714C7.14286 2.38571 7.52857 2 8 2C8.47143 2 8.85714 2.38571 8.85714 2.85714V7.14286H13.1429C13.6143 7.14286 14 7.52857 14 8C14 8.47143 13.6143 8.85714 13.1429 8.85714Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_14513_208561">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )

  const minusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M11.9997 8.61895H3.99967C3.63301 8.61895 3.33301 8.34038 3.33301 7.99991C3.33301 7.65943 3.63301 7.38086 3.99967 7.38086H11.9997C12.3663 7.38086 12.6663 7.65943 12.6663 7.99991C12.6663 8.34038 12.3663 8.61895 11.9997 8.61895Z"
        fill="#8064A2"
      />
    </svg>
  )

  const calculateTotalPrice = (
    variations: { name: string; value: string; quantity: number }[],
  ) => {
    // 1. Validate and convert variation quantities to numbers:
    const validVariations = variations.map((variation) => ({
      ...variation,
      quantity: Number(variation.quantity) || 0, // Set default quantity to 0 if not a number
    }))

    // 2. Calculate total price with error handling:
    let totalPrice = 0
    for (const variation of validVariations) {
      const price = Number(variation.value) || 0 // Handle potential non-numeric values
      totalPrice += price * variation.quantity
    }

    // 3. Return the total price as a number:
    return totalPrice
  }

  const totalPrice = calculateTotalPrice(data.variations)

  const incQuantity = (i: number) => {
    let newArr = [...data.variations]
    if (Number(newArr[i].quantity) < 9) {
      newArr[i] = { ...newArr[i], quantity: Number(newArr[i].quantity) + 1 }
      setData((prev) => ({ ...prev, variations: newArr }))
    }
  }

  const decQuantity = (i: number) => {
    let newArr = [...data.variations]
    newArr[i] = {
      ...newArr[i],
      quantity:
        Number(newArr[i].quantity) === 0 ? 0 : Number(newArr[i].quantity) - 1,
    }
    setData((prev) => ({ ...prev, variations: newArr }))
  }

  return (
    <>
      <div className={styles['modal-wrapper']}>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        />
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Variants'}</h4>
        </header>

        <hr className={styles['modal-hr']} />

        <section className={styles['body']}>
          <div className={styles['container']}>
            <div className={styles['img-and-label']}>
              {listingModalData.profile_image ? (
                <img src={listingModalData?.profile_image} alt="" />
              ) : (
                <div
                  className={`${styles['default-img']} default-program-listing-icon`}
                ></div>
              )}
              <div>
                <strong>{listingModalData?.title}</strong>
                <p>{listingModalData?.tagline}</p>
              </div>
            </div>
            <div className={styles['variations']}>
              <div className={styles['variations-list']}>
                {data.variations.map((obj, i) => (
                  <div key={i} className={styles['variant']}>
                    <TextField
                      InputProps={{
                        readOnly: true,
                      }}
                      placeholder=""
                      value={obj.name === 'No value' ? '' : obj.name}
                      className={styles['input']}
                    />
                    <div className={styles['quantity']}>
                      <button
                        onClick={() => {
                          decQuantity(i)
                        }}
                      >
                        {minusIcon}
                      </button>
                      <p>{obj.quantity}</p>
                      <button
                        onClick={() => {
                          incQuantity(i)
                        }}
                      >
                        {plusIcon}
                      </button>
                    </div>
                    <div
                      className={styles['show-value']}
                      // onChange={(e)=>{handleVariationChange(e.target.value,'value',i)}}
                    >
                      <p>
                        {
                          <Image
                            className={styles['rupees-icon']}
                            src={rupeesIcon}
                            alt="rupeesIcon"
                          />
                        }{' '}
                        {formatPrice(obj.value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className={styles['footer']}>
          <div className={styles['price']}>
            <p>
              {} {formatPrice(totalPrice)}
            </p>
          </div>
          <button
            ref={nextButtonRef}
            className="modal-footer-btn submit"
            onClick={handleSubmit}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : onComplete ? (
              'Next'
            ) : (
              'Checkout'
            )}
          </button>
          {/* SVG Button for Mobile */}
          {onComplete ? (
            <div onClick={handleSubmit}>
              <Image
                src={NextIcon}
                alt="back"
                className="modal-mob-btn cancel"
              />
            </div>
          ) : (
            <button
              ref={nextButtonRef}
              className="modal-mob-btn-save"
              onClick={handleSubmit}
            >
              {submitBtnLoading ? (
                <CircularProgress color="inherit" size={'14px'} />
              ) : (
                'Checkout'
              )}
            </button>
          )}
        </footer>
      </div>
      {
        <CustomSnackbar
          message={snackbar?.message}
          triggerOpen={snackbar?.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default ListingProductPurchase
