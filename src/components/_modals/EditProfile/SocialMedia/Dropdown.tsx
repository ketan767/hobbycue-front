import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.module.css'

// interface Props {
//   options: any;
//   placeholder: string;
//   value: string;
//   onChange: (e: any) => void;
// }

// const DropdownComponent1: React.FC<Props> = ({ options, placeholder, value, onChange }) => {
//     const inputRef = useRef<HTMLInputElement>(null)
//     const [showOptions, setShowOptions] = useState(false);
//     const [selectQuery, setSelectQuery] = useState("");

//     type SocialMediaOption =
//       | 'Facebook'
//       | 'Twitter'
//       | 'Instagram'
//       | 'YouTube'
//       | 'SoundCloud'
//       | 'Pinterest'
//       | 'Medium'
//       | 'Telegram'
//       | 'TripAdvisor'
//       | 'Ultimate Guitar'
//       | 'Strava'
//       | 'DeviantArt'
//       | 'Behance'
//       | 'GoodReads'
//       | 'Smule'
//       | 'Chess.com'
//       | 'BGG'
//       | 'Others'
    
//     const socialMediaIcons: Record<SocialMediaOption, any> = {
//       Facebook:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/facebook.svg',
//       Twitter:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/X.png',
//       Instagram:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/instagram.svg',
//       YouTube:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/youtube.svg',
//       SoundCloud:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/soundcloud.svg',
//       Pinterest:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/pinterest.svg',
//       Medium:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/MediumWeb.svg',
//       Telegram:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/Telegram.svg',
//       TripAdvisor:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/tripadvisor.svg',
//       'Ultimate Guitar':
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/Ultimate+Guitar.png',
//       Strava:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/strava.svg',
//       DeviantArt:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/DeviantArt.svg',
//       Behance:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/behance.svg',
//       GoodReads:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/GoodReads.svg',
//       Smule:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/smule.svg',
//       'Chess.com':
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/chess.com.svg',
//       BGG: 'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/bgg.svg',
//       Others:
//         'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/other.svg',
//     }
    
//     const handleFocus = () => setShowOptions(true);
//     const handleBlur = () => {
//       // Delay hiding options to allow click selection
//       setTimeout(() => setShowOptions(false), 200);
//     };

//     const [filteredOptions, setFilteredOptions] = useState(options);
//     useEffect(() => {
//         setFilteredOptions(options.filter((obj: any) => obj.socialMedia.toLowerCase().startsWith(selectQuery.toLowerCase())))
//     }, [filteredOptions]);

    
//     return (
//     <div className={styles.inputContainer} style={{width:"100%", height:"100%", position:"relative"}}>
//         <input
//             type="text"
//             value={selectQuery}
//             onChange={(e)=>{
//                 setSelectQuery(e.target.value)
//             }}
//             onFocus={handleFocus}
//             onBlur={handleBlur}
//             className={styles.dropdown}
//             ref={inputRef}
//             style={{
//                 width:"100%", 
//                 height:"100%",  
//                 padding:"10px", 
//                 fontSize: "12px",
//                 borderRadius: "8px",
//                 border: "1px solid #afafaf",
//                 background: "#f8f9fa",
//                 caretColor: selectQuery === "" ? "transparent" : "auto",
//                 color: !showOptions ? "#ffffff" : "#000000", 
//             }}
//         />
//         {
//             (!showOptions || selectQuery === "") &&
//             <div style={{position:"absolute", left:"15px", top:"calc(50% - 12px)", display:"flex", alignItems:"center"}}>
//                 <img
//                     src={socialMediaIcons[value as SocialMediaOption]}
//                     alt={value}
//                     width={24}
//                     height={24}
//                 />
//                  <p style={{marginLeft:"8px", fontSize:"12px"}}>{value}</p>
//             </div>
//         }
//         <ArrowDropDownIcon 
//             onClick={(e) => {
//                 inputRef.current?.focus()
//                 setShowOptions(!showOptions)
//             }}
//             style={{
//                 position: "absolute",
//                 right: "7px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 color: "#727273",
//                 cursor: "pointer"
//             }}
//         />
//         {showOptions &&
//             ReactDOM.createPortal(
//               <div
//                 className="custom-scrollbar-two"
//                 style={{
//                   position: "fixed",
//                   top: inputRef.current?.getBoundingClientRect().bottom || 0,
//                   left: inputRef.current?.getBoundingClientRect().left || 0,
//                   width: inputRef.current?.offsetWidth || "auto",
//                   zIndex: 9999,
//                   maxHeight: "300px",
//                   overflowY: "scroll",
//                   background: "white",
//                   boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
//                   borderRadius: "8px",
//                 }}
//               >
//                 {filteredOptions
//                   .filter((obj: any) => obj.Show === 'Y')
//                   .map((option: any, i: any) => (
//                     <div key={i} style={{ padding: "7px 10px", cursor: "pointer" }}>
//                       <div className={styles['menu-item']}>
//                         <img
//                           src={socialMediaIcons[option.socialMedia as SocialMediaOption]}
//                           alt={option.socialMedia}
//                           width={24}
//                           height={24}
//                         />
//                         <p style={{ marginLeft: "8px" }}>{option.socialMedia}</p>
//                       </div>
//                     </div>
//                   ))}
//               </div>,
//               document.body
//             )}
//     </div>
//     );
// };

interface Props {
  options: any;
  placeholder: string;
  value: string;
  onChange: (e: any) => void;
}

const DropdownComponent: React.FC<Props> = ({ options, placeholder, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [selectQuery, setSelectQuery] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightIndex, setHighlightIndex] = useState(-1); // Track highlighted option index

  useEffect(() => {
    setSelectQuery(value);
  }, [value]);

  const handleFocus = () => setShowOptions(true);
  const handleBlur = () => {
    setTimeout(() => setShowOptions(false), 200); // Delay to allow click
  };

  type SocialMediaOption =
      | 'Facebook'
      | 'Twitter'
      | 'Instagram'
      | 'YouTube'
      | 'SoundCloud'
      | 'Pinterest'
      | 'Medium'
      | 'Telegram'
      | 'TripAdvisor'
      | 'Ultimate Guitar'
      | 'Strava'
      | 'DeviantArt'
      | 'Behance'
      | 'GoodReads'
      | 'Smule'
      | 'Chess.com'
      | 'BGG'
      | 'Others'
    
    const socialMediaIcons: Record<SocialMediaOption, any> = {
      Facebook:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/facebook.svg',
      Twitter:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/X.png',
      Instagram:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/instagram.svg',
      YouTube:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/youtube.svg',
      SoundCloud:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/soundcloud.svg',
      Pinterest:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/pinterest.svg',
      Medium:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/MediumWeb.svg',
      Telegram:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/Telegram.svg',
      TripAdvisor:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/tripadvisor.svg',
      'Ultimate Guitar':
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/Ultimate+Guitar.png',
      Strava:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/strava.svg',
      DeviantArt:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/DeviantArt.svg',
      Behance:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/behance.svg',
      GoodReads:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/GoodReads.svg',
      Smule:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/smule.svg',
      'Chess.com':
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/chess.com.svg',
      BGG: 'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/bgg.svg',
      Others:
        'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/other.svg',
    }

  useEffect(() => {
    // Filter options based on input query
    setFilteredOptions(
      options.filter((obj: any) =>
        obj.socialMedia.toLowerCase().startsWith(selectQuery.toLowerCase())
      )
    );
  }, [selectQuery, options]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setHighlightIndex(0);
    if (!showOptions || filteredOptions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex !== -1) {
        const selectedOption = filteredOptions[highlightIndex];
        setSelectQuery(selectedOption.socialMedia);
        onChange(selectedOption.socialMedia);
        setShowOptions(false);
      }
    }
  };

  const [dropdownMaxHeight, setDropdownMaxHeight] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState("down");

  useEffect(() => {
    if (showOptions && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      spaceBelow > spaceAbove ? setDropdownPosition("down") : setDropdownPosition("up");
      setDropdownMaxHeight(Math.max(spaceAbove, spaceBelow) - 10);
    }
  }, [showOptions]);

  return (
    <div
      className={styles.inputContainer}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <input
        className={styles["dropdown-input"]}
        type="text"
        value={selectQuery}
        onChange={(e) => setSelectQuery(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        style={{
          width: "100%",
          height: "100%",
          padding: "10px",
          fontSize: "12px",
          borderRadius: "8px",
          border: "1px solid #afafaf",
          background: "#f8f9fa",
          caretColor: selectQuery === "" ? "transparent" : "auto",
          color: !showOptions ? "#ffffff" : "#000000",
        }}
      />
      {
        value !== "" && (!showOptions || selectQuery === "") &&
            <div style={{position:"absolute", left:"15px", top:"calc(50% - 12px)", display:"flex", alignItems:"center"}}>
                <img
                    src={socialMediaIcons[value as SocialMediaOption]}
                    alt={value}
                    width={24}
                    height={24}
                />
                 <p style={{marginLeft:"8px", fontSize:"12px"}}>{value}</p>
            </div>
        }
      <ArrowDropDownIcon
        onClick={() => {
          inputRef.current?.focus();
          setShowOptions(!showOptions);
        }}
        style={{
          position: "absolute",
          right: "7px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#727273",
          cursor: "pointer",
        }}
      />
      {showOptions &&
        ReactDOM.createPortal(
          <div
            className="custom-scrollbar-two"
            style={{
              position: "fixed",
              ...(dropdownPosition === "down"
                ? {
                    top: (inputRef.current?.getBoundingClientRect().bottom || 0) + 1, // Add 1px for "down"
                  }
                : {
                    bottom:
                      window.innerHeight -
                      (inputRef.current?.getBoundingClientRect().top || 0) -
                      1, // Subtract 1px for "up"
                  }),
              left: inputRef.current?.getBoundingClientRect().left || 0,
              width: inputRef.current?.offsetWidth || "auto",
              zIndex: 9999,
              maxHeight: dropdownMaxHeight,
              overflowY: "scroll",
              background: "white",
              boxShadow:
                "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
              borderRadius: "8px",
              transitionDuration: "0.1s",
            }}
          >
            {filteredOptions
                  .filter((obj: any) => obj.Show === 'Y')
                  .map((option: any, i: any) => (
              <div
                key={i}
                style={{
                  padding: "7px 10px",
                  cursor: "pointer",
                  backgroundColor:
                    option.socialMedia === value ? 
                    highlightIndex === i ? "#efecf4" : "#f5f3f8" :
                    highlightIndex === i ? "#f0f0f0" : "transparent",
                }}
                onMouseEnter={() => setHighlightIndex(i)}
                onClick={(e) => {
                  setSelectQuery(option.socialMedia);
                  onChange(option.socialMedia);
                  setShowOptions(false);
                }}
              >
                <div className={styles["menu-item"]}>
                  <img
                    src={socialMediaIcons[option.socialMedia as SocialMediaOption]}
                    alt={option.socialMedia}
                    width={24}
                    height={24}
                  />
                  <p style={{ marginLeft: "8px" }}>{option.socialMedia}</p>
                </div>
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

export default DropdownComponent;
