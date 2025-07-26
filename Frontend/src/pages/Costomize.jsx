import React, { useContext, useRef, useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/image3.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Costomize = () => {
 const {backendImage, setBackendImage,
        frontendImage, setFrontendImage,
        selectedImage, setSelectedImage} = useContext(userDataContext)
  const inputImage = useRef();
  const navigate = useNavigate()

  const handleImage = (e) =>{
    const file = e.target.files[0]
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file))
  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] gap-[20px]'>

      <h1 className='text-white text-[30px] text-center mb-10'>Select your <span className='text-[#8888d0b0]'>Assistant Image</span> </h1>

      <div className='w-[90%] max-[60%] flex justify-center items-center flex-wrap gap-[20px]'>
        <Card image={image1}/>
        <Card image={image2}/>
        <Card image={image3}/>
        <Card image={image4}/>
        <Card image={image5}/>
        <Card image={image6}/>
        <Card image={image7}/>
        
        <div className={`w-[70px] h-[100px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#2424cc75] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex justify-center items-center ${selectedImage=="input" ? "border-4 border-white shadow-2xl ":null}`} onClick={()=>{ inputImage.current.click()
          setSelectedImage("input")
        }
          
        }>
          {!frontendImage &&  <IoMdAdd className='text-white text-4xl'/>}
          {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
      
    </div>
    <input type="file"  accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
      </div>
      {selectedImage &&  <button type='submit' className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer' onClick={()=>navigate("/customize2")}>Next</button>}
     
      
    </div>
  )
}

export default Costomize
