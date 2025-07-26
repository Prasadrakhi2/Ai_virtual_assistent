import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'

const Customize2 = () => {

  const {userData} = useContext(userDataContext)
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "")

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] gap-[20px]'>
      <h1 className='text-white text-[30px] text-center mb-10'>Enter your <span className='text-[#8888d0b0]'>Assistant Name</span> </h1>

      <input type="text" className='w-[50%] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2 rounded-full' 
      placeholder='Ex: sora'
        required  
        onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>
        {assistantName && <button type='submit' className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer' >Create</button>}
        
    </div>
  )
}

export default Customize2
