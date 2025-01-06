import React, { useState, useRef } from 'react'
import { Button, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import StatusDropdown from '@/components/_formElements/StatusDropdown'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import CloseIcon from '@/assets/icons/CloseIcon'
import styles from './styles.module.css'
import Image from 'next/image'

type Props = {
    data?: any
    setData?: any
    handleSubmit?: any
    handleClose?: any
}

const EditHobbyModal: React.FC<Props> = ({
    data,
    setData,
    handleSubmit,
    handleClose,
}) => {
    const dispatch = useDispatch()
    const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
    const [inputErrs, setInputErrs] = useState<{ error: string | null }>({
        error: null,
    })
    const nextButtonRef = useRef<HTMLButtonElement | null>(null)
    const [snackbar, setSnackbar] = useState({
        type: 'success',
        display: false,
        message: '',
    })



    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value
        setData((prev: any) => ({ ...prev, description: value }))
        setInputErrs({ error: null })
    }

    const handleStatusChange = (newStatus: any) => {
        setData((prev: any) => ({ ...prev, status: newStatus.status }))
    }

    const handleFormSubmit = async () => {
        setSubmitBtnLoading(true)

        await handleSubmit()
    }

    return (
        <>
            <div className={`${styles['modal-wrapper']}`}>
                <header className={styles['header']}>
                    <h4 className={styles['heading']}>Edit Hobby</h4>
                    <CloseIcon
                        className={styles['modal-close-icon']}
                        onClick={handleClose}
                    />
                </header>

                <hr className={styles['modal-hr']} />

                <section className={styles['body']}>
                    {/* Row 1 */}
                    <div className={styles['input-row']}>
                        <div className={styles['input-box-wrapper']}>
                            <label htmlFor="hobby-url" className={styles['label']}>
                                Hobby URL <span className={styles['required-star']}>*</span>
                            </label>
                            <input
                                id="hobby-url"
                                type="text"
                                className={styles['input-box-element']}
                                placeholder='Unique name using dashes instead of spaces'
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="show" className={styles['label']}>
                                Show <span className={styles['required-star']}>*</span>
                            </label>
                            <div className={`${styles['input-box-element']} ${styles['input-box-element-small']}`}>
                                <input type="checkbox" id="show" className={styles['checkbox']} />
                            </div>
                        </div>
                    </div>



                    {/* Row 2 */}
                    <div className={styles['input-row']}>
                        <div className={styles['input-box-wrapper']}>
                            <label htmlFor="hobby-url" className={styles['label']}>
                                Display
                            </label>
                            <input
                                id="hobby-url"
                                type="text"
                                placeholder='The name that will come up in the searchbox'
                                className={styles['input-box-element']}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="level" className={styles['label']}>
                                Level <span className={styles['required-star']}>*</span>
                            </label>
                            <div>
                                <select id="level" className={`${styles['input-box-element']} ${styles['input-box-element-small']}`} required>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                        </div>
                    </div>



                    {/* Row 3 */}
                    <div className={styles['input-row']}>
                        <div className={styles['input-box-wrapper']}>
                            <label htmlFor="category" className={styles['label']}>
                                Category
                            </label>
                            {/* <input
                                id="category"
                                type="text"
                                className={styles['input-box-element']}
                                required
                            /> */}
                            <select
                                id="sub-category"
                                className={`${styles['input-box-element']}`}
                                required
                            >

                                <option value="arts">Arts</option>
                                <option value="sports">Sports</option>
                            </select>
                        </div>
                        <div className={styles['input-box-wrapper']}>
                            <label htmlFor="sub-category" className={styles['label']}>
                                Sub-Category
                            </label>
                            <select
                                id="sub-category"
                                className={`${styles['input-box-element']} ${styles['sub-category']}`}
                                required
                            >

                                <option value="arts">Arts</option>
                                <option value="sports">Sports</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 4 */}
                    <div className={styles['input-row']}>
                        <div className={styles['input-box-wrapper']}>
                            <label htmlFor="tags" className={styles['label']}>
                                Tags
                            </label>
                            <input
                                id="tags"
                                placeholder='search and select tags'
                                type="text"
                                className={styles['input-box-element']}
                                required
                            />
                        </div>
                        <div className={styles['input-box-wrapper']}>
                            <label htmlFor="style-type" className={styles['label']}>
                                Style Type
                            </label>
                            <select id="style-type" className={`${styles['input-box-element']} ${styles['sub-category']}`} required>
                                <option value="modern">Select style</option>
                                <option value="modern">Modern</option>
                                <option value="classic">Classic</option>
                            </select>
                        </div>
                    </div>
                </section>


                <footer className={styles['footer']}>
                    <button
                        className="modal-footer-btn submit"
                        style={{backgroundColor:''}} 
                        onClick={handleFormSubmit}
                        disabled={submitBtnLoading}
                    >
                        {submitBtnLoading ? (
                            <CircularProgress color="inherit" size="24px" />
                        ) : (
                            'Save'
                        )}
                    </button>
                </footer>
            </div>

            <CustomSnackbar
                message={snackbar?.message}
                triggerOpen={snackbar?.display}
                type={snackbar.type === 'success' ? 'success' : 'error'}
                closeSnackbar={() => {
                    setSnackbar((prevValue) => ({ ...prevValue, display: false }))
                }}
            />
        </>
    )
}

export default EditHobbyModal
