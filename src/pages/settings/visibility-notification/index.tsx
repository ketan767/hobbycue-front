import React, { useEffect, useState } from 'react'
import styles from './visibility.module.css'
import exploreStyles from '@/styles/ExplorePage.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'
import EditIcon from '../../../assets/svg/edit-colored.svg'
import GoogleIcon from '../../../assets/svg/google-icon.svg'
import FacebookIcon from '../../../assets/svg/facebook-icon.svg'
import Image from 'next/image'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import RadioButton from '@/components/radioButton/radioButton'
import { withAuth } from '@/navigation/withAuth'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useMediaQuery } from '@mui/material'
import SettingsDropdownLayout from '@/layouts/SettingsDropdownLayout'
import CustomSelect from '@/components/settings/CustomSelect/CustomSelect'
import {
  getMyProfileDetail,
  updateUserpreferences,
} from '@/services/user.service'
import { updateUser } from '@/redux/slices/user'
import PreLoader from '@/components/PreLoader'
import ExploreSidebarBtn from './components/ExploreSidebarBtn'
import QuestionIcon from '@/assets/icons/QuestionIcon'
import ViewProfileBtn from './components/viewProfile/ViewProfileBtn'

interface Preferences {
  [key: string]: any
  community_view: {
    preferred_hobby: { hobby: string | null; genre: string | null }
    preferred_location: string
  }
  create_post_pref: {
    preferred_hobby: { hobby: string | null; genre: string | null }
    preferred_location: string
  }
  location_visibility: string
  email_visibility: string
  phone_visibility: string
}

type Props = {}
const options = ['My City', 'My Locality', 'My Society']

const viewOptions = [
  'Everyone',
  'Having a common Hobby',
  'Common Hobby and City',
  'Common Society',
  'No one',
]

const VisibilityAndNotification: React.FC<Props> = ({}) => {
  const userProfileUrl = useSelector(
    (state: RootState) => state?.user?.user?.profile_url,
  )

  const user = useSelector((state: RootState) => state?.user?.user)

  const dispatch = useDispatch()
  const [preferences, setPreferences] = useState<any>({
    community_view: {
      preferred_hobby: { hobby: null, genre: null },
      preferred_location: 'All locations',
    },
    create_post_pref: {
      preferred_hobby: { hobby: null, genre: null },
      preferred_location: 'All locations',
    },
    location_visibility: 'My City',
    email_visibility: 'No one',
    phone_visibility: 'No one',
  })
  const [LocationOptions, setLocationOptions] = useState<string | any>([
    'All locations',
  ])
  const [Hobbyoptions, setHobbyOptions] = useState<string | any>([])
  const [HobbyoptionsCommunity, setHobbyoptionsCommunity] = useState<
    string | any
  >(['All Hobbies', 'My Hobbies'])
  const [hobbiesAdded, setHobbiesAdded] = useState<boolean>(false)
  useEffect(() => {
    if (user._addresses && !hobbiesAdded) {
      const LocationOptions = [
        'All locations',
        ...user._addresses.map((address: any) => `${address.city}`),
      ]

      const Hobbyoptions = [
        ...user._hobbies.map((item: any) => {
          const hobbyName = item.hobby.display
          const genreName = item.genre?.display || ''

          return genreName ? `${hobbyName} - ${genreName}` : hobbyName
        }),
      ]
      const HobbyoptionsComm = [
        ...HobbyoptionsCommunity,
        ...user._hobbies.map((item: any) => {
          const hobbyName = item.hobby.display
          const genreName = item.genre?.display || ''

          return genreName ? `${hobbyName} - ${genreName}` : hobbyName
        }),
      ]
      console.log('Hobby options', Hobbyoptions)
      console.log('User._hobbies', user._hobbies)

      setHobbyOptions(Hobbyoptions)
      setHobbyoptionsCommunity(HobbyoptionsComm)
      setLocationOptions(LocationOptions)
      setHobbiesAdded(true)
    }
  }, [user])

  useEffect(() => {
    if (user && user.preferences) {
      const updatedPreferences = {
        community_view: {
          preferred_hobby: {
            hobby:
              user.preferences.community_view.preferred_hobby?.hobby?._id ||
              null,
            genre:
              user.preferences.community_view.preferred_hobby?.genre?._id ||
              null,
          },
          preferred_location:
            user?.preferences.community_view.preferred_location?._id ||
            'All locations',
        },
        create_post_pref: {
          preferred_hobby: {
            hobby:
              user.preferences.create_post_pref.preferred_hobby?.hobby?._id ||
              null,
            genre:
              user.preferences.create_post_pref.preferred_hobby?.genre?._id ||
              null,
          },
          preferred_location:
            user.preferences.create_post_pref.preferred_location?._id ||
            'All locations',
        },
        location_visibility: user.preferences.location_visibility || 'My City',
        email_visibility: user.preferences.email_visibility || 'Everyone',
        phone_visibility: user.preferences.phone_visibility || 'Everyone',
      }

      setPreferences(updatedPreferences)
    } else if (user && user._hobbies && user._hobbies?.length>0) {
      const updatedPreferences = {
        community_view: {
          preferred_hobby: {
            hobby: null,
            genre: null,
          },
          preferred_location: null,
          all_locations: true,
          all_hobbies: true,
          my_hobbies: false,
        },
        create_post_pref: {
          preferred_hobby: {
            hobby: user._hobbies[0]?.hobby?._id
              ? user._hobbies[0]?.hobby?._id
              : null,
            genre: user._hobbies[0]?.genre?._id
              ? user._hobbies[0]?.genre?._id
              : null,
          },
          preferred_location: null,
        },
        location_visibility: 'My City',
        email_visibility: 'No one',
        phone_visibility: 'No one',
      }

      setPreferences(updatedPreferences)
      updatePreference(updatedPreferences)
    }
  }, [user])

  const updatePreference = async (preferences: any) => {
    console.log(preferences)

    try {
      const { res, err } = await updateUserpreferences({ preferences })
      if (err) {
        console.error('Error updating preferences:', err)
      } else {
        console.log('Preferences updated successfully:', res.data)
        const user = await getMyProfileDetail()
        dispatch(updateUser(user.res?.data?.data.user))
        //window.location.reload();
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  const handleSelectChange = async (
    key: string,
    subKey: string,
    value: string | { hobby: any; genre: any },
  ) => {
    let updatedPreferences = { ...preferences }

    if (
      subKey === 'preferred_hobby' &&
      value !== 'All Hobbies' &&
      value !== 'My Hobbies'
    ) {
      const [hobbyName, genreName] = (value as string).split(' - ')

      const selectedHobby = user._hobbies.find((hobby: any) => {
        const isHobbyMatch = hobby.hobby.display === hobbyName

        // Check if the genre matches only if genreName is
        const isGenreMatch = genreName
          ? hobby.genre?.display === genreName
          : true

        return isHobbyMatch && isGenreMatch
      })
      console.log(selectedHobby)
      console.log(value)

      value = {
        hobby: selectedHobby?.hobby._id || null,
        genre: selectedHobby?.genre?._id || null,
      }
    }

    if (subKey === 'preferred_location' && value !== 'All locations') {
      const [cityName, LocalityName] = (value as string).split(' - ')

      const selectedAddress = user._addresses.find((address: any) => {
        const isAddressMatch = address.city === cityName

        const isLocalityMatch = LocalityName
          ? address.locality === LocalityName
          : true

        return isAddressMatch && isLocalityMatch
      })
      console.log(selectedAddress)
      console.log(value)
      value = selectedAddress._id
    }
    updatedPreferences = {
      ...updatedPreferences,
      [key]: {
        ...updatedPreferences[key],
        [subKey]: value,
      },
    }

    setPreferences(updatedPreferences) // Update local state
    await updatePreference(updatedPreferences) // Trigger API call
  }

  const handleVisibilityChange = async (key: string, value: string) => {
    const updatedPreferences = {
      ...preferences,
      [key]: value,
    }

    setPreferences(updatedPreferences)
    await updatePreference(updatedPreferences)
  }

  const isMobile = useMediaQuery('(max-width:1100px)')
  return (
    <>
      {isMobile && (
        <aside
          className={`custom-scrollbar static-position settings-container`}
        >
          <section className={`content-box-wrapper`}>
            <header>
              <div className={'settings-title'}>
                <h1>Settings</h1>
              </div>
            </header>
          </section>
        </aside>
      )}
      <PageGridLayout column={3} customStyles={styles['settingcontainer']}>
        <SettingsDropdownLayout>
          {isMobile ? null : (
            <SettingsSidebar active="visibility-notification" />
          )}
          <div className={styles.container}>
            <p className={`${styles.textLight} ${styles.title}`}>
              {' '}
              Default and visibility settings{' '}
            </p>

            {user._addresses && (
              <>
                <div className={`${styles.viewOptionContainer}`}>
                  <p className={`${styles.textDark}`}> Community View </p>
                  <div className={styles['selectContainer']}>
                    <CustomSelect
                      // disabled={true}
                      options={HobbyoptionsCommunity}
                      onChange={(item) =>
                        handleSelectChange(
                          'community_view',
                          'preferred_hobby',
                          item,
                        )
                      }
                      value={
                        user?.preferences?.community_view?.my_hobbies
                          ? 'My Hobbies'
                          : user?.preferences?.community_view?.preferred_hobby
                              ?.hobby?.display &&
                            user?.preferences?.community_view?.preferred_hobby
                              ?.hobby?.display +
                              (user?.preferences?.community_view
                                ?.preferred_hobby?.genre?.display
                                ? ` - ${user?.preferences?.community_view?.preferred_hobby?.genre?.display}`
                                : '')
                      }
                    />
                    <p>at</p>
                    <CustomSelect
                      // disabled={true}
                      options={LocationOptions}
                      onChange={(item) =>
                        handleSelectChange(
                          'community_view',
                          'preferred_location',
                          item,
                        )
                      }
                      value={
                        user?.preferences?.community_view?.preferred_location
                          ?.city || LocationOptions[0]
                      }
                    />
                  </div>
                </div>

                <div className={`${styles.viewOptionContainer}`}>
                  <p className={`${styles.textDark}`}> Create Post Default </p>
                  <div className={styles['selectContainer']}>
                    <CustomSelect
                      // disabled={true}
                      options={Hobbyoptions}
                      onChange={(item) =>
                        handleSelectChange(
                          'create_post_pref',
                          'preferred_hobby',
                          item,
                        )
                      }
                      value={
                        (user?.preferences?.create_post_pref?.preferred_hobby
                          ?.hobby?.display !== undefined
                          ? user?.preferences?.create_post_pref?.preferred_hobby
                              ?.hobby?.display
                          : Hobbyoptions.length > 0
                          ? Hobbyoptions[0]
                          : '') +
                        (user?.preferences?.create_post_pref?.preferred_hobby
                          ?.genre?.display
                          ? ` - ${user?.preferences?.create_post_pref?.preferred_hobby?.genre?.display}`
                          : '')
                      }
                    />
                    <p>at</p>
                    <CustomSelect
                      // disabled={true}
                      options={LocationOptions}
                      onChange={(item) =>
                        handleSelectChange(
                          'create_post_pref',
                          'preferred_location',
                          item,
                        )
                      }
                      value={
                        user?.preferences?.create_post_pref?.preferred_location
                          ?.city || LocationOptions[0]
                      }
                    />
                  </div>
                </div>

                <div className={`${styles.viewOptionContainer}`}>
                  <p className={`${styles.textDark}`}>
                    {' '}
                    Others can view my Location up to{' '}
                  </p>
                  <div>
                    <CustomSelect
                      // disabled={true}
                      options={options}
                      onChange={(item) =>
                        handleVisibilityChange('location_visibility', item)
                      }
                      value={
                        user?.preferences?.location_visibility || options[0]
                      }
                    />
                  </div>
                </div>

                <div className={`${styles.viewOptionContainer}`}>
                  <p className={`${styles.textDark}`}>
                    {' '}
                    Who can view my Email ID{' '}
                  </p>
                  <div>
                    <CustomSelect
                      // disabled={true}
                      options={viewOptions}
                      onChange={(item) =>
                        handleVisibilityChange('email_visibility', item)
                      }
                      value={
                        user?.preferences?.email_visibility || viewOptions[0]
                      }
                    />
                  </div>
                </div>

                <div className={`${styles.viewOptionContainer}`}>
                  <p className={`${styles.textDark}`}>
                    {' '}
                    Who can view my Phone Number{' '}
                  </p>
                  <div>
                    <CustomSelect
                      // disabled={true}
                      options={viewOptions}
                      onChange={(item) =>
                        handleVisibilityChange('phone_visibility', item)
                      }
                      value={
                        user?.preferences?.phone_visibility || viewOptions[0]
                      }
                    />
                  </div>
                </div>
              </>
            )}

            <div className={styles.line}></div>

            <p className={styles.underDev}>
              Below features are under development. Come back soon to view this.
            </p>

            <p className={`${styles.textLight} ${styles.title}`}>
              {' '}
              Notify me when someone{' '}
            </p>
            <div className={styles.notifyEditContainer}>
              <p className={`${styles.textDark}`}>
                Mentions me using @{userProfileUrl}
              </p>
              <RadioButton disabled active={false} />
            </div>
            <div className={styles.notifyEditContainer}>
              <p className={`${styles.textDark}`}>Comments on my post</p>
              <RadioButton disabled active={false} />
            </div>
            <div className={styles.notifyEditContainer}>
              <p className={`${styles.textDark}`}>
                Accepts my request to join hobbycue
              </p>
              <RadioButton disabled active={false} />
            </div>
            <div className={styles.notifyEditContainer}>
              <p className={`${styles.textDark}`}>Invites me to join a group</p>
              <RadioButton disabled active={false} />
            </div>
            <div className={styles.notifyEditContainer}>
              <p className={`${styles.textDark}`}>Upvotes my content</p>
              <RadioButton disabled active={false} />
            </div>
            <div className={styles.notifyEditContainer}>
              <p className={`${styles.textDark}`}>Shares my content</p>
              <RadioButton disabled active={false} />
            </div>

            <div
              className={`${styles.viewOptionContainer} ${styles.emailUpdates}`}
            >
              <p className={`${styles.textDark}`}> Email updates </p>
              <div>
                <select disabled name="Select" className={styles.select}>
                  {options.map((item: any) => {
                    return (
                      <option key={item} className={styles.option}>
                        {item}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
            {isMobile && (
              <aside className={styles['aside-two']}>
                <ViewProfileBtn />
                <ExploreSidebarBtn
                  text="Help Center"
                  href="/help"
                  icon={<QuestionIcon />}
                />
              </aside>
            )}
          </div>
        </SettingsDropdownLayout>
        {!isMobile && (
          <aside className={styles['aside-two']}>
            <ViewProfileBtn />
            <ExploreSidebarBtn
              text="Help Center"
              href="/help"
              icon={<QuestionIcon />}
            />
          </aside>
        )}
      </PageGridLayout>
    </>
  )
}

export default withAuth(VisibilityAndNotification)
