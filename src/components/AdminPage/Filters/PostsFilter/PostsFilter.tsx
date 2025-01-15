import React, { useEffect, useRef, useState } from 'react';
import styles from './PostsFilter.module.css';
import ToggleButton from '@/components/_buttons/ToggleButton';
import MyDatePicker from '../../Users/DatePicker';

export interface PostModalState {
  upvotes: { min: string; max: string };
  downvotes: { min: string; max: string };
  comments: { min: string; max: string };
  author: string;
  content: string;
  hobby: string;
  location: string;
  postedAt: { start: string; end: string };
  spam: boolean;
}

const formatDate = (date: string | Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

interface FilterProps {
  modalState: PostModalState;
  setModalState?: React.Dispatch<React.SetStateAction<PostModalState>>;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setApplyFilter?: React.Dispatch<React.SetStateAction<boolean>>;
  onApplyFilter?: ()=>void;
}
const rangeFields: Array<'upvotes' | 'downvotes' | 'comments'> = ['upvotes', 'downvotes', 'comments'];
const textFields: Array<'author' | 'content' | 'hobby' | 'location'> = ['author', 'content', 'hobby', 'location'];


const PostsFilter: React.FC<FilterProps> = ({
  modalState,
  setModalState,
  setIsModalOpen,
  setApplyFilter,
  onApplyFilter
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const [showStartDateCalender, setShowStartDateCalender] = useState(false);
  const [showEndDateCalender, setShowEndDateCalender] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    setModalState?.((prev) => ({ ...prev, [field]: value }));
  };

  const handleRangeChange = (field: 'upvotes' | 'downvotes' | 'comments', subField: 'min' | 'max', value: string) => {
    setModalState?.((prev) => ({
      ...prev,
      [field]: { ...prev[field], [subField]: value },
    }));
  };

  const handleDateChange = (field: 'start' | 'end', value: Date) => {
    setModalState?.((prev) => ({
      ...prev,
      postedAt: { ...prev.postedAt, [field]: value },
    }));
  };

  const handleToggleSpam = () => {
    setModalState?.((prev) => ({ ...prev, spam: !prev.spam }));
  };

  const handleApply = () => {
    onApplyFilter?.();
    setApplyFilter?.(true);
    setIsModalOpen?.(false);
  };

  const handleClear = () => {
    setModalState?.({
      upvotes: { min: '', max: '' },
      downvotes: { min: '', max: '' },
      comments: { min: '', max: '' },
      author: '',
      content: '',
      hobby: '',
      location: '',
      postedAt: { start: '', end: '' },
      spam: false,
    });
    setIsModalOpen?.(false);
  };

  // Close modal on clicking outside
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          setIsModalOpen?.(false);
        }
      }
    
      // Close modal on pressing 'Esc'
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsModalOpen?.(false);
        }
      }
    
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside)
          document.removeEventListener('keydown', handleKeyDown)
        }
      }, [])

  return (
    <main className={styles.modal} ref={modalRef}>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>Filter</h2>
        <div className={styles.wrapper}>
          <button className={styles.clearButton} onClick={handleClear}>
            Clear
          </button>
          <button className={styles.applyButton} onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
      <div className={styles.modalBody}>
        {/* Range Fields */}
        {rangeFields.map((field) => (
          <div className={styles.filterGroup} key={field}>
            <label className={styles.filterLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <p className={styles.textRange}>
              <input
                type="text"
                placeholder="Min"
                className={styles.textInput}
                value={modalState[field].min || ''}
                onChange={(e) => handleRangeChange(field as any, 'min', e.target.value)}
              />
              <span>-</span>
              <input
                type="text"
                placeholder="Max"
                className={styles.textInput}
                value={modalState[field].max || ''}
                onChange={(e) => handleRangeChange(field as any, 'max', e.target.value)}
              />
            </p>
          </div>
        ))}

        {/* Text Fields */}
        {textFields.map((field) => (
          <div className={styles.filterGroup} key={field}>
            <label className={styles.filterLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              className={styles.textInput}
              value={modalState[field] || ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
            />
          </div>
        ))}

        {/* Date Field */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Posted At</label>
          <p className={styles.dateRange}>
            <button
              className={styles.dateButton}
              onClick={() => setShowStartDateCalender((prev) => !prev)}
            >
              {modalState.postedAt.start ? formatDate(modalState.postedAt.start) : 'Start'}
            </button>
            {showStartDateCalender && (
              <MyDatePicker
                updateState={() => setShowStartDateCalender(false)}
                handleDatePick={(date) => handleDateChange('start', date)}
              />
            )}

            <span style={{ color: '#6D747A', margin: '0 4px' }}>-</span>

            <button
              className={styles.dateButton}
              onClick={() => setShowEndDateCalender((prev) => !prev)}
            >
              {modalState.postedAt.end ? formatDate(modalState.postedAt.end) : 'End'}
            </button>
            {showEndDateCalender && (
              <MyDatePicker
                updateState={() => setShowEndDateCalender(false)}
                handleDatePick={(date) => handleDateChange('end', date)}
              />
            )}
          </p>
        </div>

        {/* Toggle Field */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Spam</label>
          <ToggleButton isOn={modalState.spam} handleToggle={handleToggleSpam}/>
        </div>
      </div>
    </main>
  );
};

export default PostsFilter;
