import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material'

import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'

import styles from './styles.module.css'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'

const CustomCKEditor = dynamic(() => import('@/components/CustomCkEditor'), {
  ssr: false,
  loading: () => <h1>Loading...</h1>,
})

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

type ListingAboutData = {
  description: InputData<string>
}

type TagItem = string
const tags = [
  {
    tag: 'Teach',
    desc: 'Do you conduct classes or workshops?',
  },
  {
    tag: 'Home Classes',
    desc: `Do you visit the student's home to conduct `,
  },
  {
    tag: '1 on 1 classes',
    desc: 'Do you conduct 1-on-1 individual classes',
  },
  {
    tag: 'Online Classes',
    desc: 'Do you conduct online classes?',
  },
  {
    tag: 'Collabs',
    desc: 'Are you open to collaborate with others?',
  },
  {
    tag: 'Shows',
    desc: 'Do you participate in concerts?',
  },
  {
    tag: 'Compose',
    desc: 'Do you compose or design a show?',
  },
  {
    tag: 'Parking',
    desc: 'Is parking available at the venue?',
  },
  {
    tag: 'Home Delivery',
    desc: 'Do you provide home delivery?',
  },
  {
    tag: 'Ride Share',
    desc: 'Do you recommend ride sharing to get here?',
  },
  {
    tag: 'Products',
    desc: 'Do you sell or rent products from here?',
  },
  {
    tag: 'Space',
    desc: 'Do you rent out spaces for practice or shows?',
  },
  {
    tag: 'Performances',
    desc: 'Is there an auditorium or performance venue?',
  },
  {
    tag: 'Parking',
    desc: 'Is parking available at the venue?',
  },
  {
    tag: 'Ride Share',
    desc: 'Can people share rides while coming here?',
  },
  {
    tag: 'Food Counter',
    desc: 'Is there a cafe or facility for food stall?',
  },
  {
    tag: 'Shop',
    desc: 'Any souvenir or other shops at this venue?',
  },
  {
    tag: 'Walk-in',
    desc: 'Can one walk-in without a reservation?',
  },
]

const ListingTagsEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)

  const [data, setData] = useState<ListingAboutData>({
    description: { value: '', error: null },
  })
  const [tagsData, setTagsData] = useState(tags)
  let tag_texts = tags.map((item) => item.tag)
  const [tagTexts, setTagTexts] = useState<string[]>([])
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const handleInputChange = (value: string) => {
    setData((prev) => {
      return { ...prev, description: { value, error: null } }
    })
  }

  const handleSubmit = async () => {
    if (isEmptyField(data.description.value)) {
      return setData((prev) => {
        return {
          ...prev,
          description: {
            ...prev.description,
            error: 'This field is required!',
          },
        }
      })
    }

    setSubmitBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, {
      description: data.description.value,
    })
    setSubmitBtnLoading(false)
    if (err) return console.log(err)
    if (res?.data.success) {
      dispatch(updateListingModalData(res.data.data.listing))
      if (onComplete) onComplete()
      else {
        window.location.reload()
        dispatch(closeModal())
      }
    }
  }

  useEffect(() => {
    setData((prev) => {
      return {
        description: {
          ...prev.description,
          value: listingModalData.description as string,
        },
      }
    })
  }, [user])

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'About'}</h4>
        </header>
        <hr />
        <section className={styles['body']}>
          <div className={styles['input-box']}>
            <label>Add Tags</label>
            <input hidden required />

            <FormControl variant="outlined" size="small" sx={{ width: '100%' }}>
              <Select
                value={tagTexts}
                multiple={true}
                onChange={(e) => {
                  let val = e.target.value
                  setTagTexts((prev: any) => val as any)
                }}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {tags.map((item: any, idx) => {
                  return (
                    <MenuItem key={idx} value={item.tag}>
                      <div className={styles.tagContainer}>
                        <p className={styles.tagText}>{item.tag}</p>
                        <p className={styles.tagDesc}>{item.desc}</p>
                      </div>
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <button
              className="modal-footer-btn cancel"
              onClick={onBackBtnClick}
            >
              Back
            </button>
          )}

          <button
            className="modal-footer-btn submit"
            onClick={handleSubmit}
            disabled={submitBtnLoading}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : onComplete ? (
              'Next'
            ) : (
              'Save'
            )}
          </button>
        </footer>
      </div>
    </>
  )
}

export default ListingTagsEditModal

/**
 * @TODO:
 * 1. Loading component until the CK Editor loads.
 * 2. Underline option in the editor
 */
