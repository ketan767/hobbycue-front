import React, { useState } from 'react'
import Image from 'next/image'
import styles from './localization.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'
import AddIcon from '../../../assets/svg/add.svg'
import EditIcon from '../../../assets/svg/vertical-bars.svg'
import RadioUnselected from '../../../assets/svg/radio-unselected.svg'
import RadioSelected from '../../../assets/svg/radio-selected.svg'
import InputSelect from '@/components/InputSelect/inputSelect'
import { withAuth } from '@/navigation/withAuth'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import Address from './address'
import { updateAddressToEdit, updateUser } from '@/redux/slices/user'
import {
  deleteUserAddress,
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import { countryData } from '@/utils/countrydata'
import { useMediaQuery } from '@mui/material'
import SettingsDropdownLayout from '@/layouts/SettingsDropdownLayout'

let options = {
  region: countryData.map((item) => item.name),
  currency: countryData.map((item) => item.currency),
  distance: ['km', 'mi'],
  language: ['English', 'French', 'German'],
  phone: countryData.map((item) => item.phonePrefix),
}

const defaultValues = {
  region: options.region[options.region.indexOf('India')],
  language: options.language[0],
  currency: options.currency[0],
  phonePrefix: options.phone[options.region.indexOf('India')],
  distance: options.distance[0],
}

const VisibilityAndNotification: React.FC = () => {
  const [inpSelectValues, setInpSelectValues] = useState(defaultValues)
  const { user, activeProfile } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()

  const handleAddLocation = () => {
    dispatch(openModal({ type: 'add-location', closable: false }))
  }

  const handleAddressEdit = (id: string) => {
    dispatch(updateAddressToEdit(id))
    dispatch(openModal({ type: 'user-address-edit', closable: true }))
  }

  const handleDeleteAddress = (id: string, isPrimaryAddress: boolean) => {
    deleteUserAddress(id, async (err, res) => {
      if (err) {
        return console.log(err)
      }
      if (!res.data.success) {
        return alert('Something went wrong!')
      }

      const { err: error, res: response } = await getMyProfileDetail()
      if (error) return console.log(error)

      if (response?.data.success) {
        if (
          isPrimaryAddress &&
          response.data.data.user._addresses?.length > 0
        ) {
          // Set first address as the new primary address, if exists
          const newPrimaryAddress = response.data.data.user._addresses[0]
          const body = {
            primary_address: newPrimaryAddress._id,
          }
          const updateResult = await updateMyProfileDetail(body)
          if (updateResult.err) {
            console.log(updateResult.err)
            return
          }
          window.location.reload()
        }

        dispatch(updateUser(response.data.data.user))
      }
    })
  }
  const isMobile = useMediaQuery('(max-width:1100px)')

  return (
    <>
      <PageGridLayout column={2} customStyles={styles['settingcontainer']}>
        <SettingsDropdownLayout>
          {isMobile ? null : <SettingsSidebar active="localization-payments" />}
          <div className={styles.container}>
            <div className={`${styles.flex} ${styles.addSectionContainer}`}>
              <p className={`${styles.textLight}`}> Addresses </p>
              <div
                className={`${styles.flex} ${styles['clickable']} `}
                onClick={handleAddLocation}
              >
                <Image
                  src={AddIcon}
                  width={16}
                  height={16}
                  alt="add"
                  className={styles.addIcon}
                />
                <p className={styles.textColored}> add new location</p>
              </div>
            </div>

            {user._addresses?.map((address: any) => {
              return (
                <Address
                  key={address?._id}
                  address={address}
                  handleAddressEdit={handleAddressEdit}
                  handleDeleteAddress={handleDeleteAddress}
                  isPrimary={user?.primary_address?._id === address?._id}
                />
              )
            })}

            <div className={styles.line}></div>

            {/* <div className={`${styles.cardContainer}`}>
            <div className={`${styles.addressLeft}`}>
              <Image
                src={RadioUnselected}
                width={16}
                height={16}
                alt="radio"
                className={styles.addIcon}
              />
              <div className={styles.addressContent}>
                <p className={`${styles.textDark} ${styles.labelText}`}>
                  {' '}
                  Visa ending in 1234{' '}
                </p>
                <p className={`${styles.textLight} ${styles.addressText}`}>
                  <span className={styles.addressText}>Expire: 09/2070F</span>
                </p>
              </div>
            </div>
            <Image
              src={EditIcon}
              width={16}
              height={16}
              alt="edit"
              className={styles.addIcon}
            />
          </div>
          <div className={`${styles.cardContainer}`}>
            <div className={`${styles.addressLeft}`}>
              <Image
                src={RadioUnselected}
                width={16}
                height={16}
                alt="radio"
                className={styles.addIcon}
              />
              <div className={styles.addressContent}>
                <p className={`${styles.textDark} ${styles.labelText}`}>
                  {' '}
                  RuPay ending in 1234{' '}
                </p>
                <p className={`${styles.textLight} ${styles.addressText}`}>
                  <span className={styles.addressText}>Expire: 09/2070F</span>
                </p>
              </div>
            </div>
            <Image
              src={EditIcon}
              width={16}
              height={16}
              alt="edit"
              className={styles.addIcon}
            />
          </div> */}

            <p className={`${styles.textLight}`}> Localization </p>

            <div className={`${styles.flex} ${styles.localizationContainer}`}>
              <p className={`${styles.textDark} ${styles.labelText}`}>
                {' '}
                Region{' '}
              </p>
              <InputSelect
                options={options['region']}
                value={inpSelectValues.region}
                onChange={(e: any) => {
                  setInpSelectValues((prevValue) => {
                    let regionIndex = options.region.indexOf(e)
                    return {
                      ...prevValue,
                      region: e,
                      phonePrefix: options.phone[regionIndex],
                    }
                  })
                }}
              />
            </div>

            <div className={`${styles.flex} ${styles.localizationContainer}`}>
              <p className={`${styles.textDark} ${styles.labelText}`}>
                {' '}
                Language{' '}
              </p>
              <InputSelect
                options={options['language']}
                value={inpSelectValues.language}
                onChange={(e: any) => {
                  setInpSelectValues((prevValue) => ({
                    ...prevValue,
                    language: e,
                  }))
                }}
              />
            </div>

            <div className={`${styles.flex} ${styles.localizationContainer}`}>
              <p className={`${styles.textDark} ${styles.labelText}`}>
                {' '}
                Currency{' '}
              </p>
              <InputSelect
                options={options['currency']}
                value={`${inpSelectValues.currency} ${
                  countryData?.find(
                    (country) => country.currency === inpSelectValues.currency,
                  )?.currencySymbol
                }`}
                onChange={(e: any) => {
                  console.log(
                    `${e} ${
                      countryData?.find((country) => `${country.currency} ${country.currencySymbol}` === e)
                        ?.currencySymbol
                    }`,
                  )
                  setInpSelectValues((prevValue) => ({
                    ...prevValue,
                    currency: e,
                  }))
                }}
                optionValues={countryData.map(
                  (country) => `${country.currency} ${country.currencySymbol}`,
                )}
              />
            </div>

            <div className={`${styles.flex} ${styles.localizationContainer}`}>
              <p className={`${styles.textDark} ${styles.labelText}`}>
                {' '}
                Phone Prefix{' '}
              </p>
              <InputSelect
                options={options['phone']}
                value={inpSelectValues.phonePrefix}
                onChange={(e: any) => {
                  setInpSelectValues((prevValue) => ({
                    ...prevValue,
                    phonePrefix: e,
                  }))
                }}
              />
            </div>

            <div className={`${styles.flex} ${styles.localizationContainer}`}>
              <p className={`${styles.textDark} ${styles.labelText}`}>
                {' '}
                Distance{' '}
              </p>
              <InputSelect
                options={options['distance']}
                value={inpSelectValues.distance}
                onChange={(e: any) => {
                  setInpSelectValues((prevValue) => ({
                    ...prevValue,
                    distance: e,
                  }))
                }}
              />
            </div>
            <div className={styles.line}></div>
            <p className={styles.underDev}>
              This feature is under development. Come back soon to view this.
            </p>
            <div className={`${styles.flex} ${styles.addSectionContainer}`}>
              <p className={`${styles.textLight}`}> Payment options </p>
              <div className={`${styles.flex}`}>
                <Image
                  src={AddIcon}
                  width={16}
                  height={16}
                  alt="add"
                  className={styles.addIcon}
                />
                <p className={styles.textColored}>
                  {' '}
                  add a credit or debit card{' '}
                </p>
              </div>
            </div>
          </div>
        </SettingsDropdownLayout>
      </PageGridLayout>
    </>
  )
}

export default withAuth(VisibilityAndNotification)
