import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { useLocation } from 'react-router-dom'

const useGetCurrentUser = () => {
    const location=useLocation()
    const dispatch=useDispatch()
    useEffect(()=>{
        const getCurrentUser=async()=>{
            try {
                const result=await axios.get(`${serverUrl}/api/user/me`,{
                    withCredentials:true
                })
                dispatch(setUserData(result.data))
                console.log(result)
            } catch (error) {
                console.log(error)
                dispatch(setUserData(null))
            }
        }
        getCurrentUser()
    },[location.pathname])
}

export default useGetCurrentUser
