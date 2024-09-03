import React, { useState } from 'react'
import ReactSimplyCarousel from 'react-simply-carousel'
import styles from './VerticalSlider.module.css'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import PauseIcon from '@/assets/svg/play_arrow.svg'
import { openModal } from '@/redux/slices/modal'
import ReactPlayer from 'react-player'

type PropType = {
  data: ListingPageData['pageData']
  UploadProfileImg: Function
  uploadIcon: React.ReactNode
  videoimg: string
  handleImageChange: Function
}

const ProductImageSlider: React.FC<PropType> = ({
  data,
  UploadProfileImg,
  uploadIcon,
  videoimg,
  handleImageChange,
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const { listingLayoutMode } = useSelector((state: any) => state.site)

  const dispatch = useDispatch()

  return (
    <div>
      <ReactSimplyCarousel
        activeSlideIndex={activeSlideIndex}
        onRequestChange={setActiveSlideIndex}
        itemsToShow={1}
        itemsToScroll={1}
        centerMode={true}
        autoplay={false}
        infinite={false}
        forwardBtnProps={{
          //here you can also pass className, or any other button element attributes
          style: {
            display: 'none',
            // alignSelf: 'center',
            // background: 'black',
            // border: 'none',
            // borderRadius: '50%',
            // color: 'white',
            // cursor: 'pointer',
            // fontSize: '20px',
            // height: 30,
            // lineHeight: 1,
            // textAlign: 'center',
            // width: 30,
          },
          children: <span>{`>`}</span>,
        }}
        backwardBtnProps={{
          //here you can also pass className, or any other button element attributes
          style: {
            display: 'none',
            // alignSelf: 'center',
            // background: 'black',
            // border: 'none',
            // borderRadius: '50%',
            // color: 'white',
            // cursor: 'pointer',
            // fontSize: '20px',
            // height: 30,
            // lineHeight: 1,
            // textAlign: 'center',
            // width: 30,
          },
          children: <span>{`<`}</span>,
        }}
        dotsNav={{
          show: true,
          containerProps: {
            style: { textAlign: 'center', marginTop: '10px' },
          },
          itemBtnProps: {
            style: {
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#EAE4DD',
              margin: '0 5px',
            },
          },
          activeItemBtnProps: {
            style: {
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#8064A2',
              margin: '0 5px',
            },
          },
        }}
        speed={400}
        easing="linear"
      >
        {/* 1st slide - image*/}
        {data.profile_image ? (
          <Box>
            <img className={styles.image} src={data?.profile_image} />
          </Box>
        ) : (
          <Box
            className={`${styles['upload-item']} ${
              listingLayoutMode === 'view' ? styles['item-view'] : ''
            }`}
          >
            {listingLayoutMode === 'edit' ? (
              <>
                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  className={styles.hidden}
                  onChange={(e) => UploadProfileImg(e, 'profile')}
                />
                {uploadIcon}
                <p>Add Image</p>
              </>
            ) : (
              ''
            )}
          </Box>
        )}

        {/* 2nd slide - video */}
        {data?.video_url ? (
          <Box className={styles['active-image']}>
            <ReactPlayer
              width="100%"
              height="100%"
              url={data?.video_url}
              controls={true}
            />
          </Box>
        ) : (
          listingLayoutMode === 'edit' && (
            <Box
              onClick={() => {
                dispatch(
                  openModal({
                    type: 'upload-video-page',
                    closable: true,
                  }),
                )
              }}
              className={`${styles['item']} ${
                listingLayoutMode === 'view' ? styles['item-view'] : ''
              }`}
            >
              {uploadIcon}
              <p>Add Video</p>{' '}
            </Box>
          )
        )}

        {/* slides for array of images */}
        {data.images.map((image: any, index: any) => (
          <Box key={index}>
            {image && <img className={styles.image} src={image} />}
          </Box>
        ))}

        {listingLayoutMode === 'edit' && (
          <Box
            className={`${styles['upload-item']} ${
              listingLayoutMode === 'view' ? styles['item-view'] : ''
            }`}
          >
            <input
              type="file"
              accept="image/png, image/gif, image/jpeg"
              className={styles.hidden}
              onChange={(e) => {
                handleImageChange(e)
              }}
            />
            {uploadIcon}
            <p>Add Image</p>
          </Box>
        )}
      </ReactSimplyCarousel>
    </div>
  )
}

export default ProductImageSlider

function Box({
  children,
  className,
  onClick,
}: {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div style={{ padding: 3 }}>
      <div className={className + ' ' + styles.box} onClick={onClick}>
        {children}
      </div>
    </div>
  )
}
