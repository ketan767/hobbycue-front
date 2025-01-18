import React, { useState, useRef, useEffect } from 'react'
import { Button, CircularProgress, FormControl } from '@mui/material'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import CloseIcon from '@/assets/icons/CloseIcon'
import styles from './styles.module.css'
import { getAllHobbies } from '@/services/hobby.service'
import Image from 'next/image'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'
import DownArrow from '@/assets/svg/chevron-down.svg'
import UpArrow from '@/assets/svg/chevron-up.svg'
import CrossIcon from '@/assets/svg/cross.svg'

type Props = {
    data?: any
    setData?: any
    handleSubmit?: any
    handleClose?: any
}

const EditHobbyModal: React.FC<Props> = ({ data, handleSubmit, handleClose }) => {
    // console.log(data);

    const dispatch = useDispatch()
    const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [snackbar, setSnackbar] = useState<{
        type: 'success' | 'error';
        display: boolean;
        message: string;
    }>({
        type: 'success',
        display: false,
        message: '',
    })
    const [list, setList] = useState<{ name: string; description: string, id: string }[]>([])

    // State for form data
    const [formData, setFormData] = useState({
        slug: data?.slug,
        show: data?.show,
        display: data?.display,
        level: data?.level,
        category: data?.category?._id,
        sub_category: data?.sub_category?._id,
        tags: data?.tags?.map((item : any)=>item?._id),
        styleType: '',
    })
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);



    const handleSelectValue = (item: any) => {
        if (!selectedValues.includes(item.name)) {
            setSelectedValues((prev) => [...prev, item.name]);
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, item.id],
            }));
            // setSelectedId((prev) => [...prev, item.id]);
        }
        setShowDropdown(false);
    };

    const handleRemoveValue = (value:any) => {
        setSelectedValues((prev) => prev.filter((item) => item !== value.name));
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((id : any) => id !== value.id),
        }));
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            handleClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        getAllHobbies(`level=0`)
            .then((res) => {
                setCategories(res.res.data.hobbies);
                setSelectedValues(data?.tags?.map((item : any)=>item?.display))
            })
            .catch((err) => console.log({ err }))
    }, [])

    useEffect(() => {
        if (formData.category) {
            getAllHobbies(`level=1&category=${formData.category}`)
                .then((res) => setSubcategories(res.res.data.hobbies))
                .catch((err) => console.log({ err }))
        }
    }, [formData.category])

    useEffect(() => {

        getAllHobbies(`level=0&level=1&level=2&level=3&level=4&level=5`)
            .then((res) => setList(res.res.data.hobbies.sort((a:any, b:any) => a.display.localeCompare(b.display)).map((h: any) => {
                return {
                    name: h.display,
                    description: h.description,
                    id: h._id,
                }
            })))
            .catch((err) => console.log({ err }))

    }, [])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = event.target as HTMLInputElement;
        const { id, value, type, checked } = target
        setFormData((prev) => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleChange = (item: any) => {
        console.log(item);

    }

    const handleFormSubmit = async () => {
        console.log("formData : ", formData);

        setSubmitBtnLoading(true)
        try {
            await handleSubmit({ ...data, ...formData });
            setSnackbar({
                type: 'success',
                display: true,
                message: 'Hobby updated successfully!',
            })
        } catch (error) {
            setSnackbar({
                type: 'error',
                display: true,
                message: 'Failed to update hobby.',
            })
        } finally {
            setSubmitBtnLoading(false)
        }
    }

    return (
        <>
            <div className={`${styles['modal-wrapper']}`} ref={dropdownRef}>
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
                            <label htmlFor="hobbyUrl" className={styles['label']}>
                                Hobby URL <span className={styles['required-star']}>*</span>
                            </label>
                            <input
                                id="slug"
                                type="text"
                                className={styles['input-box-element']}
                                placeholder="Unique name using dashes instead of spaces"
                                value={formData.slug}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="show" className={styles['label']}>
                                Show <span className={styles['required-star']}>*</span>
                            </label>
                            <input
                                id="show"
                                type="checkbox"
                                className={styles['checkbox']}
                                checked={formData.show}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className={styles['input-row']}>
                        <div className={styles['input-box-wrapper']}>
                            <label htmlFor="display" className={styles['label']}>
                                Display Name
                            </label>
                            <input
                                id="display"
                                type="text"
                                className={styles['input-box-element']}
                                placeholder="The name that will come up in the searchbox"
                                value={formData.display}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="level" className={styles['label']}>
                                Level <span className={styles['required-star']}>*</span>
                            </label>
                            <select
                                id="level"
                                className={styles['input-box-element']}
                                value={formData.level}
                                onChange={handleInputChange}
                                required
                            >
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className={styles['input-row']}>
                        <div className={styles['input-box-wrapper']}>
                            <label htmlFor="category" className={styles['label']}>
                                Category
                            </label>
                            <select
                                id="category"
                                className={styles['input-box-element']}
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map((category: any) => (
                                    <option key={category._id} value={category._id}>
                                        {category.display}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles['input-box-wrapper']}>
                            <label htmlFor="subcategory" className={styles['label']}>
                                Sub-Category
                            </label>
                            <select
                                id="sub_category"
                                className={styles['input-box-element']}
                                value={formData.sub_category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select sub-category</option>
                                {subcategories.map((subcategory: any) => (
                                    <option key={subcategory._id} value={subcategory._id}>
                                        {subcategory.display}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Row 4 */}
                    {selectedValues.length > 0 && (
                        <div className={styles['selected-values']}>
                            {selectedValues.map((value, index) => (
                                <div key={index} className={styles['selected-value']}>
                                    <span>{value}</span>
                                    <button
                                        type="button"
                                        className={styles['remove-btn']}
                                        onClick={() => handleRemoveValue({name : value,id: selectedId[index]})}
                                    >
                                        <Image
                                            src={CrossIcon}
                                            alt="down"

                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className={styles['input-row']}>

                        <div className={styles['input-box-wrapper']}>
                            <label htmlFor="tags" className={styles['label']}>
                                Tags
                            </label>
                            <div className={styles['dropdown-container']}>

                                <div
                                    className={styles['dropdown']}
                                    onClick={() => setShowDropdown((prev) => !prev)}
                                >
                                    <p className={styles['dropdown-placeholder']}>
                                        {selectedValues.length === 0 ? 'Select tags' : ''}
                                    </p>
                                    <div>
                                        <Image
                                            src={showDropdown ? UpArrow : DownArrow}
                                            alt="down"
                                        />
                                    </div>
                                </div>
                                {showDropdown && (
                                    <div className={styles['dropdown-options']}>
                                        {list.map((option,index) => (
                                            <div
                                                key={option.id}
                                                className={`${styles["dropdown-option"]} ${selectedValues.some((item) => item === option.name)
                                                        ? styles["selected-option"]
                                                        : ""
                                                    }`}
                                                onClick={() => handleSelectValue(option)}
                                            >
                                                <div style={{display:'flex',gap:4}}>
                                                    <p className={styles.tagDesc}>{option.name}</p>
                                                    <p className={styles.tagDesc}>
                                                        {option.description?.slice(0, 18)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className={styles['input-box-wrapper']}>
                            <label htmlFor="styleType" className={styles['label']}>
                                Style Type
                            </label>
                            <select
                                id="styleType"
                                className={styles['input-box-element']}
                                value={formData.styleType}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select style</option>
                                <option value="modern">Modern</option>
                                <option value="classic">Classic</option>
                            </select>
                        </div>
                    </div>
                </section>

                <footer className={styles['footer']}>
                    <button
                        className="modal-footer-btn submit"
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
                message={snackbar.message}
                triggerOpen={snackbar.display}
                type={snackbar.type}
                closeSnackbar={() => setSnackbar((prev) => ({ ...prev, display: false }))}
            />
        </>
    )
}

export default EditHobbyModal
