import React, { useContext, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import bgImage from '../assets/authBg.png'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import { userDataContext } from '../context/UserContext';
import axios from 'axios'

const SignUp = () => {

  // toggle eye
  const[showPassword, setshowPassword] = useState(false)
  const navigate = useNavigate();
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const[err, setErr] = useState("")
  const[loading, setLoading] = useState(false)

  const { serverUrl, userData, setUserData } = useContext(userDataContext)

  // signin data to backend connctivity
  const handleSignUp = async (e)=>{
    e.preventDefault(); //use to stop auto refresh
    setErr("")
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`, {name, email, password}, {withCredentials : true}) //use to connect with backend and use withcredentials for pass cookie or messages
      setUserData(result.data)
       setLoading(false)
       navigate("/customize")
      
    } catch (error) {
      console.log(error)
      setUserData(null)
       setLoading(false)
      setErr(error.response.data.message)
    }
  }
  

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage: `url(${bgImage})`}}>
      <form onSubmit={ handleSignUp} action="" className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] p-[20px]'>
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to <span className='text-blue-500'>Virtual Assistant</span> </h1>
        <input type="text" placeholder='Enter your Name' className='w-full outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2 rounded-full' required onChange={(e)=> setName(e.target.value)}/>
        <input 
        type="email" 
        autoComplete="email"
        placeholder='Enter your email' className='w-full outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2 rounded-full' 
        required 
        onChange={(e)=> setEmail(e.target.value)}/>
        
        {/* eye of password */}
        <div className='w-full border-2 border-white bg-transparent text-white rounded-full relative'>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="new-password"
            placeholder='password'
            className='py-2 px-5 w-full h-full rounded-full outline-none bg-transparent pr-12'
            required
            onChange={(e)=> setPassword(e.target.value)}
          />
          {!showPassword &&  <FaRegEye className='absolute right-4 top-1/2 transform -translate-y-1/2 w-[25px] h-[25px] text-white cursor-pointer' onClick={()=> setshowPassword(true)}/>}
          {showPassword &&  <FaRegEyeSlash className='absolute right-4 top-1/2 transform -translate-y-1/2 w-[25px] h-[25px] text-white cursor-pointer' onClick={()=> setshowPassword(false)} />} 
        </div>

        {err.length > 0 && <p className='text-red-500'>*{err}</p>}


        <button type='submit' className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]' disabled={loading}>{loading ? "loading" :"Sign Up"}</button>

        <p className='text-white text-[18px] '>Already have an account ? <span className='text-blue-400 cursor-pointer' onClick={()=> navigate('/login')}>Login</span></p>
      </form>
    </div>
  )
}

export default SignUp
