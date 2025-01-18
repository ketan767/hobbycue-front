import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import {
    Button,
    CircularProgress,
    FormControl,
    MenuItem,
    Select,
} from '@mui/material'

import {
    getAllUserDetail,
    getMyProfileDetail,
    updateMyProfileDetail,
} from '@/services/user.service'
import Image from 'next/image'

import styles from './styles.module.css'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import { closeModal, openModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { updateListingModalData } from '@/redux/slices/site'
import {
    getAllListingCategories,
    updateListing,
} from '@/services/listing.service'

import DownArrow from '@/assets/svg/chevron-down.svg'
import UpArrow from '@/assets/svg/chevron-up.svg'
import TickIcon from '@/assets/svg/tick.svg'
import CrossIcon from '@/assets/svg/cross.svg'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import { getAdminHobbies } from '@/services/admin.service'
import { getHobbyMembers } from '@/services/hobby.service'

type Props = {
    onSave?: any;
    onBackBtnClick?: () => void
    confirmationModal?: boolean
    setConfirmationModal?: any
    handleClose?: any
    isError?: boolean
    onStatusChange?: (isChanged: boolean) => void
    type?: string;
    data?: any
}

const HobbyRelatedEditModal: React.FC<Props> = ({
    onSave,
    onBackBtnClick,
    confirmationModal,
    setConfirmationModal,
    handleClose,
    onStatusChange,
    type,
    data,
}) => {
    const { listingModalData, listingTypeModalMode, pageDataForEvent } =
        useSelector((state: RootState) => state.site)
    const [list, setList] = useState<{ name: string; description: string, id: string }[]>([])
    const [pagedata, setPagedata] = useState([])
    const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
    const [value, setValue] = useState<any>([])
    const [id, setId] = useState<any>([])
    const [hoveredValue, setHoveredValue] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');

    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef: any = useRef()
    useOutsideAlerter(dropdownRef, () => {
        setShowDropdown(false)
        setHoveredValue(null)
        handleClose();
    })
    const [initialData, setInitialData] = useState<any>([])
    const [isChanged, setIsChanged] = useState(false)

    const handleSubmit = async () => {
        setError('')
        if (!value || value === '' || value.length === 0) {
            return setError('Select a Hobby!')
        }
        onSave(id)
    }


    useEffect(() => {
        const fetchData = async () => {


            try {
                let data = [];
                if (type === 'Related') {
                    const { res } = await getAdminHobbies(`sort=-createdAt`);
                    // console.log(res.data);

                    data = res.data.data.hobbies.map((item: any) => ({
                        name: item.display || item.slug || "None",
                        description: (item.description || 'No description available').slice(0, 80) + '....',
                        id: item._id
                    }));

                } else if (type === 'Admin') {


                    const { res } = await getAllUserDetail(
                        `sort=-last_login&populate=_addresses`,
                    )

                    data = res.data.data.users
                        .filter((item: any) => item !== null && item !== undefined && item?.display_name || item?.full_name) // Filter out null or undefined items
                        .map((item: any) => ({
                            name: item?.display_name || item?.full_name?.slice(0, 30) || "Unknown user",
                            description: (item?.about || item?.tagline + " " + item?._addresses[0]?.city || 'No description available').slice(0, 50) + '....',
                            id: item._id
                        }));
                }
                // console.log(data);

                setList(data.sort((a: any, b: any) => a.name.localeCompare(b.name)));
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };

        const setData = async () => {
            if (type === 'Related') {
                setValue(data?.related_hobbies.map((key: any) => key?.display || key.slug))
                setId(data?.related_hobbies.map((key: any) => key?._id))
            } else if (type === 'Admin') {
                const { res } = await getHobbyMembers(data._id);
                const users = res.data.users.filter((item: any) => item !== null && item !== undefined)
                // console.log(users);
                setValue(users.map((key: any) => key?.display_name || key?.full_name.slice(0, 18) || "Unknown user"))
                setId(users.map((key: any) => key?._id))
            }
        };

        fetchData();
        setData();
    }, [type]);



    const handleChange = (itemToChange: any) => {
        setSearchQuery('');
        if (value?.includes(itemToChange.name)) {
            // Clear error when removing a value
            setError('');
            setValue((prev: any) => prev.filter((item: any) => item !== itemToChange.name));
            setId((prev: any) => prev.filter((item: any) => item !== itemToChange.id));
        } else {
            // Clear error when adding a value within the limit
            setError('');
            if (value) {
                setValue((prev: any) => [...prev, itemToChange.name]);
                setId((prev: any) => [...prev, itemToChange.id]);
            } else {
                setValue([itemToChange.name]);
                setId([itemToChange.id]);
            }
        }
    };

    const HandleSaveError = async () => {
        if (!value || value === '' || value.length === 0) {
            setIsError(true)
        }
    }

    useEffect(() => {
        const hasChanges = JSON.stringify(value) !== JSON.stringify(initialData)
        setIsChanged(hasChanges)

        if (onStatusChange) {
            onStatusChange(hasChanges)
        }
    }, [value, initialData, onStatusChange])

    useEffect(() => {
        if (confirmationModal) {
            HandleSaveError()
        }
    }, [confirmationModal])

    useEffect(() => {
        if (isError) {
            const timer = setTimeout(() => {
                setIsError(false)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [isError])

    const nextButtonRef = useRef<HTMLButtonElement | null>(null)
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            console.log({ event })

            if (event.key === 'Enter') {
                nextButtonRef.current?.focus()
            }
        }

        window.addEventListener('keydown', handleKeyPress)

        return () => {
            window.removeEventListener('keydown', handleKeyPress)
        }
    }, [])

    if (confirmationModal) {
        return (
            <SaveModal
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                setConfirmationModal={setConfirmationModal}
                isError={isError}
            />
        )
    }

    const filteredList = list.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

        return nameMatch;
    });


    return (
        <>
            <div className={styles['modal-container']} ref={dropdownRef}>
                <div className={styles['modal-wrapper']}>
                    <CloseIcon
                        className={styles['modal-close-icon']}
                        onClick={handleClose}
                    />
                    {/* Modal Header */}
                    <header className={styles['header']}>
                        <h4 className={styles['heading']}>
                            {type}
                        </h4>
                    </header>

                    <hr className={styles['modal-hr']} />

                    <section className={styles['body'] + ' custom-scrollbar'}>
                        <div
                            className={styles['input-box']}
                            style={value?.length === 0 || !value ? { marginTop: '1rem' } : {}}
                        >
                            <input hidden required />
                            {value.length > 0 && (
                                <div className={styles['selected-values']}>
                                    {value?.map((item: any, index: number) => {
                                        const ids = id[index];
                                        return (
                                            <div key={item} className={styles['selected-value']}>
                                                <p>{item}</p>
                                                <Image
                                                    src={CrossIcon}
                                                    alt="cancel"
                                                    onClick={() => handleChange({ name: item, id: ids })}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <FormControl variant="outlined" size="small">
                                <div className={styles['select-container']} ref={dropdownRef}>
                                    <div
                                        tabIndex={0}
                                        className={`${styles['select-input']} ${error ? styles['select-input-error'] : ''}`}
                                        onClick={() =>
                                            setShowDropdown((prev) => {
                                                if (prev === true) {
                                                    setHoveredValue(null);
                                                }
                                                return !prev;
                                            })
                                        }
                                        onKeyDown={(e) => {
                                            if (['Enter'].includes(e.key) || e.key === ' ') {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (e.key === 'Enter' && showDropdown && hoveredValue !== null) {
                                                    handleChange(filteredList[hoveredValue!]);
                                                    setShowDropdown(false);
                                                    setHoveredValue(null);
                                                } else if (!showDropdown) {
                                                    setShowDropdown(true);
                                                    setHoveredValue(0);
                                                }
                                            } else if (e.key === 'ArrowUp' && showDropdown && hoveredValue !== null) {
                                                setHoveredValue((prev) => (prev === 0 ? filteredList.length - 1 : prev! - 1));
                                            } else if (e.key === 'ArrowDown' && showDropdown && hoveredValue !== null) {
                                                setHoveredValue((prev) => (prev === filteredList.length - 1 ? 0 : prev! + 1));
                                            }
                                        }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search and select Related hobbies"
                                            value={searchQuery}
                                            onChange={(e) => { setSearchQuery(e.target.value) }}
                                        />
                                        <Image src={showDropdown ? UpArrow : DownArrow} alt="down" />
                                    </div>
                                    {showDropdown && (
                                        <div className={styles['options-container'] + ' custom-scrollbar'}>
                                            {filteredList.map((item, idx) => {
                                                console.log(item);

                                                const desc = item.description.trim();
                                                return (
                                                    <div
                                                        key={item.name}
                                                        className={`${styles['single-option']} ${value?.includes(item.name) ? styles['selcted-option'] : ''} ${hoveredValue === idx && styles['hovered-single-option']}`}
                                                        onClick={() => {
                                                            handleChange(item);
                                                            setShowDropdown(false);
                                                            setHoveredValue(null);
                                                        }}
                                                    >
                                                        <p className={styles.tagDesc}>{item.name}</p>

                                                        <p className={styles.tagDesc}>{item.description}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <p className={styles.error}>{error}</p>
                            </FormControl>
                        </div>
                    </section>

                    <footer className={styles['footer']}>
                        {Boolean(onBackBtnClick) && (
                            <>
                                <button
                                    className="modal-footer-btn cancel"
                                    onClick={onBackBtnClick}
                                >
                                    {backBtnLoading ? (
                                        <CircularProgress color="inherit" size={'24px'} />
                                    ) : onBackBtnClick ? (
                                        'Back'
                                    ) : (
                                        'Back'
                                    )}
                                </button>
                                {/* SVG Button for Mobile */}
                                <div onClick={onBackBtnClick}>
                                    <Image
                                        src={BackIcon}
                                        alt="Back"
                                        className="modal-mob-btn cancel"
                                    />
                                </div>
                            </>
                        )}

                        <button
                            ref={nextButtonRef}
                            className="modal-footer-btn submit"
                            onClick={handleSubmit}
                        >
                            {submitBtnLoading ? (
                                <CircularProgress color="inherit" size={'24px'} />
                            ) :
                                'Save'
                            }
                        </button>


                    </footer>
                </div>
            </div>
        </>
    )
}

export default HobbyRelatedEditModal
