type HobbyData = {
  hobby: string
  genre: string
  hobbyId: string
  genreId: string
}
const removeHobbyOption = (hobbyToRemove: HobbyData,selectedHobbies:HobbyData[]) => {
  let currentHobbies = selectedHobbies
  const newHobbyData = currentHobbies.filter((hobbyData:HobbyData) => {
    if (hobbyData.genre && hobbyToRemove.genre) {
      if (hobbyData.genre === hobbyToRemove.genre) {
        return false
      } else {
        return true
      }
    } else if (hobbyData.genre && !hobbyToRemove.genre) {
      return true
    } else if (!hobbyData.genre && hobbyToRemove.genre) {
      return true
    } else {
      if (hobbyData.hobby === hobbyToRemove.hobby) {
        return false
      } else {
        return true
      }
    }
  })
  return newHobbyData
}
export default removeHobbyOption
