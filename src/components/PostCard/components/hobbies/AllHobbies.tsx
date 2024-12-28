import React from 'react'

const AllHobbies = ({ postData }: { postData: any }) => {
  return (
    <>
      {postData?._allHobbies?._hobby1?.display ? (
        <>
          <span>
            {`${postData?._allHobbies?._hobby1?.display}${
              postData?._allHobbies?._genre1?.display
                ? ' - ' + postData?._allHobbies?._genre1?.display
                : ''
            }`}
            {postData?._allHobbies?._hobby2?.display ? ', ' : ''}
            {`${
              postData?._allHobbies?._hobby2?.display
                ? postData?._allHobbies?._hobby2?.display
                : ''
            }${
              postData?._allHobbies?._genre2?.display
                ? ' - ' + postData?._allHobbies?._genre2?.display
                : ''
            }`}
            {postData?._allHobbies?._hobby3?.display ? ', ' : ''}
            {`${
              postData?._allHobbies?._hobby3?.display
                ? postData?._allHobbies?._hobby3?.display
                : ''
            }${
              postData?._allHobbies?._genre3?.display
                ? ' - ' + postData?._allHobbies?._genre3?.display
                : ''
            }`}
          </span>
        </>
      ) : (
        <span>{`${postData?._hobby?.display}${
          postData._genre ? ' - ' + postData?._genre?.display : ''
        }`}</span>
      )}
    </>
  )
}

export default AllHobbies
