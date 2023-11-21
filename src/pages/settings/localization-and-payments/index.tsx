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

const countryData = [
  { name: 'Afghanistan', currency: 'AFN', phonePrefix: '+93' },
  { name: 'Albania', currency: 'ALL', phonePrefix: '+355' },
  { name: 'Algeria', currency: 'DZD', phonePrefix: '+213' },
  { name: 'Andorra', currency: 'EUR', phonePrefix: '+376' },
  { name: 'Angola', currency: 'AOA', phonePrefix: '+244' },
  { name: 'Antigua & Deps', currency: 'XCD', phonePrefix: '+1' },
  { name: 'Argentina', currency: 'ARS', phonePrefix: '+54' },
  { name: 'Armenia', currency: 'AMD', phonePrefix: '+374' },
  { name: 'Australia', currency: 'AUD', phonePrefix: '+61' },
  { name: 'Austria', currency: 'EUR', phonePrefix: '+43' },
  { name: 'Azerbaijan', currency: 'AZN', phonePrefix: '+994' },
  { name: 'Bahamas', currency: 'BSD', phonePrefix: '+1' },
  { name: 'Bahrain', currency: 'BHD', phonePrefix: '+973' },
  { name: 'Bangladesh', currency: 'BDT', phonePrefix: '+880' },
  { name: 'Barbados', currency: 'BBD', phonePrefix: '+1' },
  { name: 'Belarus', currency: 'BYN', phonePrefix: '+375' },
  { name: 'Belgium', currency: 'EUR', phonePrefix: '+32' },
  { name: 'Belize', currency: 'BZD', phonePrefix: '+501' },
  { name: 'Benin', currency: 'XOF', phonePrefix: '+229' },
  { name: 'Bhutan', currency: 'BTN', phonePrefix: '+975' },
  { name: 'Bolivia', currency: 'BOB', phonePrefix: '+591' },
  { name: 'Bosnia Herzegovina', currency: 'BAM', phonePrefix: '+387' },
  { name: 'Botswana', currency: 'BWP', phonePrefix: '+267' },
  { name: 'Brazil', currency: 'BRL', phonePrefix: '+55' },
  { name: 'Brunei', currency: 'BND', phonePrefix: '+673' },
  { name: 'Bulgaria', currency: 'BGN', phonePrefix: '+359' },
  { name: 'Burkina', currency: 'XOF', phonePrefix: '+226' },
  { name: 'Burundi', currency: 'BIF', phonePrefix: '+257' },
  { name: 'Cambodia', currency: 'KHR', phonePrefix: '+855' },
  { name: 'Cameroon', currency: 'XAF', phonePrefix: '+237' },
  { name: 'Canada', currency: 'CAD', phonePrefix: '+1' },
  { name: 'Cape Verde', currency: 'CVE', phonePrefix: '+238' },
  { name: 'Central African Rep', currency: 'XAF', phonePrefix: '+236' },
  { name: 'Chad', currency: 'XAF', phonePrefix: '+235' },
  { name: 'Chile', currency: 'CLP', phonePrefix: '+56' },
  { name: 'China', currency: 'CNY', phonePrefix: '+86' },
  { name: 'Colombia', currency: 'COP', phonePrefix: '+57' },
  { name: 'Comoros', currency: 'KMF', phonePrefix: '+269' },
  { name: 'Congo', currency: 'XAF', phonePrefix: '+242' },
  { name: 'Congo {Democratic Rep}', currency: 'CDF', phonePrefix: '+243' },
  { name: 'Costa Rica', currency: 'CRC', phonePrefix: '+506' },
  { name: 'Croatia', currency: 'HRK', phonePrefix: '+385' },
  { name: 'Cuba', currency: 'CUP', phonePrefix: '+53' },
  { name: 'Cyprus', currency: 'EUR', phonePrefix: '+357' },
  { name: 'Czech Republic', currency: 'CZK', phonePrefix: '+420' },
  { name: 'Denmark', currency: 'DKK', phonePrefix: '+45' },
  { name: 'Djibouti', currency: 'DJF', phonePrefix: '+253' },
  { name: 'Dominica', currency: 'XCD', phonePrefix: '+1' },
  { name: 'Dominican Republic', currency: 'DOP', phonePrefix: '+1' },
  { name: 'East Timor', currency: 'USD', phonePrefix: '+670' },
  { name: 'Ecuador', currency: 'USD', phonePrefix: '+593' },
  { name: 'Egypt', currency: 'EGP', phonePrefix: '+20' },
  { name: 'El Salvador', currency: 'USD', phonePrefix: '+503' },
  { name: 'Equatorial Guinea', currency: 'XAF', phonePrefix: '+240' },
  { name: 'Eritrea', currency: 'ERN', phonePrefix: '+291' },
  { name: 'Estonia', currency: 'EUR', phonePrefix: '+372' },
  { name: 'Ethiopia', currency: 'ETB', phonePrefix: '+251' },
  { name: 'Fiji', currency: 'FJD', phonePrefix: '+679' },
  { name: 'Finland', currency: 'EUR', phonePrefix: '+358' },
  { name: 'France', currency: 'EUR', phonePrefix: '+33' },
  { name: 'Gabon', currency: 'XAF', phonePrefix: '+241' },
  { name: 'Gambia', currency: 'GMD', phonePrefix: '+220' },
  { name: 'Georgia', currency: 'GEL', phonePrefix: '+995' },
  { name: 'Germany', currency: 'EUR', phonePrefix: '+49' },
  { name: 'Ghana', currency: 'GHS', phonePrefix: '+233' },
  { name: 'Greece', currency: 'EUR', phonePrefix: '+30' },
  { name: 'Grenada', currency: 'XCD', phonePrefix: '+1' },
  { name: 'Guatemala', currency: 'GTQ', phonePrefix: '+502' },
  { name: 'Guinea', currency: 'GNF', phonePrefix: '+224' },
  { name: 'Guinea-Bissau', currency: 'XOF', phonePrefix: '+245' },
  { name: 'Guyana', currency: 'GYD', phonePrefix: '+592' },
  { name: 'Haiti', currency: 'HTG', phonePrefix: '+509' },
  { name: 'Honduras', currency: 'HNL', phonePrefix: '+504' },
  { name: 'Hungary', currency: 'HUF', phonePrefix: '+36' },
  { name: 'Iceland', currency: 'ISK', phonePrefix: '+354' },
  { name: 'India', currency: 'INR', phonePrefix: '+91' },
  { name: 'Indonesia', currency: 'IDR', phonePrefix: '+62' },
  { name: 'Iran', currency: 'IRR', phonePrefix: '+98' },
  { name: 'Iraq', currency: 'IQD', phonePrefix: '+964' },
  { name: 'Ireland {Republic}', currency: 'EUR', phonePrefix: '+353' },
  { name: 'Israel', currency: 'ILS', phonePrefix: '+972' },
  { name: 'Italy', currency: 'EUR', phonePrefix: '+39' },
  { name: 'Ivory Coast', currency: 'XOF', phonePrefix: '+225' },
  { name: 'Jamaica', currency: 'JMD', phonePrefix: '+1' },
  { name: 'Japan', currency: 'JPY', phonePrefix: '+81' },
  { name: 'Jordan', currency: 'JOD', phonePrefix: '+962' },
  { name: 'Kazakhstan', currency: 'KZT', phonePrefix: '+7' },
  { name: 'Kenya', currency: 'KES', phonePrefix: '+254' },
  { name: 'Kiribati', currency: 'AUD', phonePrefix: '+686' },
  { name: 'Korea North', currency: 'KPW', phonePrefix: '+850' },
  { name: 'Korea South', currency: 'KRW', phonePrefix: '+82' },
  { name: 'Kosovo', currency: 'EUR', phonePrefix: '+383' },
  { name: 'Kuwait', currency: 'KWD', phonePrefix: '+965' },
  { name: 'Kyrgyzstan', currency: 'KGS', phonePrefix: '+996' },
  { name: 'Laos', currency: 'LAK', phonePrefix: '+856' },
  { name: 'Latvia', currency: 'EUR', phonePrefix: '+371' },
  { name: 'Lebanon', currency: 'LBP', phonePrefix: '+961' },
  { name: 'Lesotho', currency: 'LSL', phonePrefix: '+266' },
  { name: 'Liberia', currency: 'LRD', phonePrefix: '+231' },
  { name: 'Libya', currency: 'LYD', phonePrefix: '+218' },
  { name: 'Liechtenstein', currency: 'CHF', phonePrefix: '+423' },
  { name: 'Lithuania', currency: 'EUR', phonePrefix: '+370' },
  { name: 'Luxembourg', currency: 'EUR', phonePrefix: '+352' },
  { name: 'Macedonia', currency: 'MKD', phonePrefix: '+389' },
  { name: 'Madagascar', currency: 'MGA', phonePrefix: '+261' },
  { name: 'Malawi', currency: 'MWK', phonePrefix: '+265' },
  { name: 'Malaysia', currency: 'MYR', phonePrefix: '+60' },
  { name: 'Maldives', currency: 'MVR', phonePrefix: '+960' },
  { name: 'Mali', currency: 'XOF', phonePrefix: '+223' },
  { name: 'Malta', currency: 'EUR', phonePrefix: '+356' },
  { name: 'Marshall Islands', currency: 'USD', phonePrefix: '+692' },
  { name: 'Mauritania', currency: 'MRU', phonePrefix: '+222' },
  { name: 'Mauritius', currency: 'MUR', phonePrefix: '+230' },
  { name: 'Mexico', currency: 'MXN', phonePrefix: '+52' },
  { name: 'Micronesia', currency: 'USD', phonePrefix: '+691' },
  { name: 'Moldova', currency: 'MDL', phonePrefix: '+373' },
  { name: 'Monaco', currency: 'EUR', phonePrefix: '+377' },
  { name: 'Mongolia', currency: 'MNT', phonePrefix: '+976' },
  { name: 'Montenegro', currency: 'EUR', phonePrefix: '+382' },
  { name: 'Morocco', currency: 'MAD', phonePrefix: '+212' },
  { name: 'Mozambique', currency: 'MZN', phonePrefix: '+258' },
  { name: 'Myanmar, {Burma}', currency: 'MMK', phonePrefix: '+95' },
  { name: 'Namibia', currency: 'NAD', phonePrefix: '+264' },
  { name: 'Nauru', currency: 'AUD', phonePrefix: '+674' },
  { name: 'Nepal', currency: 'NPR', phonePrefix: '+977' },
  { name: 'Netherlands', currency: 'EUR', phonePrefix: '+31' },
  { name: 'New Zealand', currency: 'NZD', phonePrefix: '+64' },
  { name: 'Nicaragua', currency: 'NIO', phonePrefix: '+505' },
  { name: 'Niger', currency: 'XOF', phonePrefix: '+227' },
  { name: 'Nigeria', currency: 'NGN', phonePrefix: '+234' },
  { name: 'Norway', currency: 'NOK', phonePrefix: '+47' },
  { name: 'Oman', currency: 'OMR', phonePrefix: '+968' },
  { name: 'Pakistan', currency: 'PKR', phonePrefix: '+92' },
  { name: 'Palau', currency: 'USD', phonePrefix: '+680' },
  { name: 'Panama', currency: 'PAB', phonePrefix: '+507' },
  { name: 'Papua New Guinea', currency: 'PGK', phonePrefix: '+675' },
  { name: 'Paraguay', currency: 'PYG', phonePrefix: '+595' },
  { name: 'Peru', currency: 'PEN', phonePrefix: '+51' },
  { name: 'Philippines', currency: 'PHP', phonePrefix: '+63' },
  { name: 'Poland', currency: 'PLN', phonePrefix: '+48' },
  { name: 'Portugal', currency: 'EUR', phonePrefix: '+351' },
  { name: 'Qatar', currency: 'QAR', phonePrefix: '+974' },
  { name: 'Romania', currency: 'RON', phonePrefix: '+40' },
  { name: 'Russian Federation', currency: 'RUB', phonePrefix: '+7' },
  { name: 'Russian Federation', currency: 'RUB', phonePrefix: '+7' },
  { name: 'Rwanda', currency: 'RWF', phonePrefix: '+250' },
  { name: 'St Kitts & Nevis', currency: 'XCD', phonePrefix: '+1-869' },
  { name: 'St Lucia', currency: 'XCD', phonePrefix: '+1-758' },
  {
    name: 'Saint Vincent & the Grenadines',
    currency: 'XCD',
    phonePrefix: '+1-784',
  },
  { name: 'Samoa', currency: 'WST', phonePrefix: '+685' },
  { name: 'San Marino', currency: 'EUR', phonePrefix: '+378' },
  { name: 'Sao Tome & Principe', currency: 'STN', phonePrefix: '+239' },
  { name: 'Saudi Arabia', currency: 'SAR', phonePrefix: '+966' },
  { name: 'Senegal', currency: 'XOF', phonePrefix: '+221' },
  { name: 'Serbia', currency: 'RSD', phonePrefix: '+381' },
  { name: 'Seychelles', currency: 'SCR', phonePrefix: '+248' },
  { name: 'Sierra Leone', currency: 'SLL', phonePrefix: '+232' },
  { name: 'Singapore', currency: 'SGD', phonePrefix: '+65' },
  { name: 'Slovakia', currency: 'EUR', phonePrefix: '+421' },
  { name: 'Slovenia', currency: 'EUR', phonePrefix: '+386' },
  { name: 'Solomon Islands', currency: 'SBD', phonePrefix: '+677' },
  { name: 'Somalia', currency: 'SOS', phonePrefix: '+252' },
  { name: 'South Africa', currency: 'ZAR', phonePrefix: '+27' },
  { name: 'South Sudan', currency: 'SSP', phonePrefix: '+211' },
  { name: 'Spain', currency: 'EUR', phonePrefix: '+34' },
  { name: 'Sri Lanka', currency: 'LKR', phonePrefix: '+94' },
  { name: 'Sudan', currency: 'SDG', phonePrefix: '+249' },
  { name: 'Suriname', currency: 'SRD', phonePrefix: '+597' },
  { name: 'Swaziland', currency: 'SZL', phonePrefix: '+268' },
  { name: 'Sweden', currency: 'SEK', phonePrefix: '+46' },
  { name: 'Switzerland', currency: 'CHF', phonePrefix: '+41' },
  { name: 'Syria', currency: 'SYP', phonePrefix: '+963' },
  { name: 'Taiwan', currency: 'TWD', phonePrefix: '+886' },
  { name: 'Tajikistan', currency: 'TJS', phonePrefix: '+992' },
  { name: 'Tanzania', currency: 'TZS', phonePrefix: '+255' },
  { name: 'Thailand', currency: 'THB', phonePrefix: '+66' },
  { name: 'Togo', currency: 'XOF', phonePrefix: '+228' },
  { name: 'Tonga', currency: 'TOP', phonePrefix: '+676' },
  { name: 'Trinidad & Tobago', currency: 'TTD', phonePrefix: '+1-868' },
  { name: 'Tunisia', currency: 'TND', phonePrefix: '+216' },
  { name: 'Turkey', currency: 'TRY', phonePrefix: '+90' },
  { name: 'Turkmenistan', currency: 'TMT', phonePrefix: '+993' },
  { name: 'Tuvalu', currency: 'AUD', phonePrefix: '+688' },
  { name: 'Uganda', currency: 'UGX', phonePrefix: '+256' },
  { name: 'Ukraine', currency: 'UAH', phonePrefix: '+380' },
  { name: 'United Arab Emirates', currency: 'AED', phonePrefix: '+971' },
  { name: 'United Kingdom', currency: 'GBP', phonePrefix: '+44' },
  { name: 'United States', currency: 'USD', phonePrefix: '+1' },
  { name: 'Uruguay', currency: 'UYU', phonePrefix: '+598' },
  { name: 'Uzbekistan', currency: 'UZS', phonePrefix: '+998' },
  { name: 'Vanuatu', currency: 'VUV', phonePrefix: '+678' },
  { name: 'Vatican City', currency: 'EUR', phonePrefix: '+379' },
  { name: 'Venezuela', currency: 'VES', phonePrefix: '+58' },
  { name: 'Vietnam', currency: 'VND', phonePrefix: '+84' },
  { name: 'Yemen', currency: 'YER', phonePrefix: '+967' },
  { name: 'Zambia', currency: 'ZMW', phonePrefix: '+260' },
  { name: 'Zimbabwe', currency: 'ZWL', phonePrefix: '+263' },
]

let options = {
  region: countryData.map((item) => item.name),
  currency: countryData.map((item) => item.currency),
  distance: ['km', 'mi'],
  language: ['English', 'French', 'German'],
  phone: countryData.map((item) => item.phonePrefix),
}

const VisibilityAndNotification: React.FC = () => {
  const { user, activeProfile } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()

  const [inpSelectValues, setInpSelectValues] = useState({
    region: options.region[0],
    language: options.language[0],
    currency: options.currency[0],
    phonePrefix: options.phone[0],
    distance: options.distance[0],
  })

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

  return (
    <>
      <PageGridLayout column={2} customStyles={styles['settingcontainer']}>
        <SettingsSidebar active="" />
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
              <p className={styles.textColored}> add a credit or debit card </p>
            </div>
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
          </div>

          <p className={`${styles.textLight}`}> Localization </p>

          <div className={`${styles.flex} ${styles.localizationContainer}`}>
            <p className={`${styles.textDark} ${styles.labelText}`}> Region </p>
            <InputSelect
              options={options['region']}
              value={inpSelectValues.region}
              onChange={(e:any)=>{
                setInpSelectValues(prevValue=>{
                  let regionIndex=(options.region).indexOf(e)
                  return({...prevValue,region:e,phonePrefix:options.phone[regionIndex]})
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
              onChange={(e:any)=>{setInpSelectValues(prevValue=>({...prevValue,language:e}))}}
              />
          </div>

          <div className={`${styles.flex} ${styles.localizationContainer}`}>
            <p className={`${styles.textDark} ${styles.labelText}`}>
              {' '}
              Currency{' '}
            </p>
            <InputSelect
              options={options['currency']}
              value={inpSelectValues.currency}
              onChange={(e:any)=>{setInpSelectValues(prevValue=>({...prevValue,currency:e}))}}
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
              onChange={(e:any)=>{setInpSelectValues(prevValue=>({...prevValue,phonePrefix:e}))}}
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
              onChange={(e:any)=>{setInpSelectValues(prevValue=>({...prevValue,distance:e}))}}
            />
          </div>
        </div>
      </PageGridLayout>
    </>
  )
}

export default withAuth(VisibilityAndNotification)
