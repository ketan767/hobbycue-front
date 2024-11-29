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
import { updateUserpreferences } from '@/services/user.service'
import { updateUser } from '@/redux/slices/user'
import PreLoader from '@/components/PreLoader'

type Props = {}
const options = [
  'My City',
  'My Locality',
  'My Society',
]

const viewOptions = [
  'Everyone',
  'Having a common Hobby',
  'Common Hobby and City',
  'Common Society',
  'No one'
]

const VisibilityAndNotification: React.FC<Props> = ({ }) => {
  const userProfileUrl = useSelector(
    (state: RootState) => state?.user?.user?.profile_url,
  )

  const user = useSelector(
    (state: RootState) => state?.user?.user,
  )

  const [preferences, setPreferences] = useState({
    community_view: { preferred_hobby: { hobby: null, genre: null }, preferred_location: 'All locations' },
    create_post_pref: { preferred_hobby: { hobby: null, genre: null }, preferred_location: 'All locations' },
    location_visibility: 'My City',
    email_visibility: 'Everyone',
    phone_visibility: 'Everyone',
  });
  const [LocationOptions, setLocationOptions] = useState<string|any>(["All locations"]);
  const [Hobbyoptions, setHobbyOptions] = useState<string|any>(["All hobbies"]);

  useEffect(() => {
    if(user._addresses){
      const LocationOptions = ['All locations', ...user._addresses.map((address: any) => `${address.city}`)]

    const Hobbyoptions = ["All hobbies", ...user._hobbies.map((item: any) => {
      const hobbyName = item.hobby.display;
      const genreName = item.genre?.display || '';

      return genreName ? `${hobbyName} - ${genreName}` : hobbyName;
    })];

    setHobbyOptions(Hobbyoptions);
    setLocationOptions(LocationOptions);
    }
  }, [user])

  const updatePreference = async (preferences: any) => {
    console.log(user);

    try {
      const { res, err } = await updateUserpreferences({ preferences });
      if (err) {
        console.error('Error updating preferences:', err);
      } else {
        console.log('Preferences updated successfully:', res.data);
        //dispatch(updateUser(res.data.data.user))
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };


  const handleSelectChange = async (key: string, subKey: string, value: string | { hobby: any, genre: any }) => {

    let updatedPreferences = { ...preferences };

    if (subKey === 'preferred_hobby' && value !== 'All hobbies') {
      const [hobbyName, genreName] = value.split(' - ');

      const selectedHobby = user._hobbies.find((hobby: any) => {
        const isHobbyMatch = hobby.hobby.display === hobbyName;

        // Check if the genre matches only if genreName is provided
        const isGenreMatch = genreName ? hobby.genre?.display === genreName : true;

        return isHobbyMatch && isGenreMatch;
      });
      console.log(selectedHobby);
      console.log(value);

      value = {
        hobby: selectedHobby?.hobby._id || null,
        genre: selectedHobby?.genre?._id || null,
      };
    }

    if (subKey === 'preferred_location' && value !== 'All locations') {
      const [cityName, LocalityName] = (value as string).split(' - ');

      const selectedAddress = user._addresses.find((address: any) => {
        const isAddressMatch = address.city === cityName;

        const isLocalityMatch = LocalityName ? address.locality === LocalityName : true;

        return isAddressMatch && isLocalityMatch;
      });
      console.log(selectedAddress);
      console.log(value);
      value = selectedAddress._id
    }
    updatedPreferences = {
      ...updatedPreferences,
      [key]: {
        ...updatedPreferences[key],
        [subKey]: value,
      },
    };

    setPreferences(updatedPreferences);  // Update local state
    await updatePreference(updatedPreferences);  // Trigger API call
  };

  const handleVisibilityChange = async (key: string, value: string) => {
    const updatedPreferences = {
      ...preferences,
      [key]: value,
    };

    setPreferences(updatedPreferences);
    await updatePreference(updatedPreferences);
  };


  const isMobile = useMediaQuery('(max-width:1100px)')
  return (
    <>
    
      {isMobile && <aside className={`custom-scrollbar static-position settings-container`}>
        <section className={`content-box-wrapper`}>
          <header>
            <div className={'settings-title'}>
              <h1>Settings</h1>
            </div>
          </header>
        </section>
      </aside>}
      <PageGridLayout column={2} customStyles={styles['settingcontainer']}>
        <SettingsDropdownLayout>
          {isMobile ? null : (
            <SettingsSidebar active="visibility-notification" />
          )}
          <div className={styles.container}>
            <p className={styles.underDev}>
              Below features are under development. Come back soon to view this.
            </p>
            <p className={`${styles.textLight} ${styles.title}`}>
              {' '}
              Default and visibility settings{' '}
            </p>

            <div className={`${styles.viewOptionContainer}`}>
              <p className={`${styles.textDark}`}> Community View </p>
              <div className={styles['selectContainer']}>
                <CustomSelect options={Hobbyoptions} onChange={(item) => handleSelectChange('community_view', 'preferred_hobby', item)} />
                <p>at</p>
                <CustomSelect options={LocationOptions} onChange={(item) => handleSelectChange('community_view', 'preferred_location', item)} />
              </div>
            </div>

            <div className={`${styles.viewOptionContainer}`}>
              <p className={`${styles.textDark}`}> Create Post Default </p>
              <div className={styles['selectContainer']}>
                <CustomSelect options={Hobbyoptions} onChange={(item) => handleSelectChange('create_post_pref', 'preferred_hobby', item)} />
                <p>at</p>
                <CustomSelect options={LocationOptions} onChange={(item) => handleSelectChange('create_post_pref', 'preferred_location', item)} />
              </div>
            </div>

            <div className={`${styles.viewOptionContainer}`}>
              <p className={`${styles.textDark}`}> Others can view my Location up to </p>
              <div>
                <CustomSelect options={options} onChange={(item) => handleVisibilityChange('location_visibility', item)} />
              </div>
            </div>

            <div className={`${styles.viewOptionContainer}`}>
              <p className={`${styles.textDark}`}> Who can view my Email ID </p>
              <div>
                <CustomSelect options={viewOptions} onChange={(item) => handleVisibilityChange('email_visibility', item)} />
              </div>
            </div>

            <div className={`${styles.viewOptionContainer}`}>
              <p className={`${styles.textDark}`}> Who can view my Phone Number </p>
              <div>
                <CustomSelect options={viewOptions} onChange={(item) => handleVisibilityChange('phone_visibility', item)} />
              </div>
            </div>

            <div className={styles.line}></div>

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
          </div>
        </SettingsDropdownLayout>
      </PageGridLayout>
    </>
  )
}

export default withAuth(VisibilityAndNotification)
