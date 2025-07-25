import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Card = ({image}) => {
    const {backendImage, setBackendImage,
            frontendImage, setFrontendImage,
            selectedImage, setSelectedImage} = useContext(userDataContext)
  return (
    <div className={`w-[70px] h-[100px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#2424cc75] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage==image ? "border-4 border-white shadow-2xl ":null}`} onClick={()=>setSelectedImage(image)}>
        <img src={image} className='h-full object-cover' alt="" />
      
    </div>
  )
}

export default Card
