import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Home = () => {
  const {userData} = useContext(userDataContext)
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col'>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden '>
        {userData?.assistantImage ? (
          <img src={userData.assistantImage} alt="Assistant" className='h-full'/>
        ) : (
          <div className='h-full w-full flex items-center justify-center text-white'>
            Image not available
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
