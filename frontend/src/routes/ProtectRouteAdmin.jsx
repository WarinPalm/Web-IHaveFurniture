import React, { useState, useEffect } from 'react'
import useEcomStore from '../store/ecom-store'
import { currentAdmin } from '../api/auth'
import LoadingToRedirect from './LoadingToRedirect'


const ProtectRouteAdmin = ({ element }) => {
    const [ ok, setOk ] = useState(false)
    const user = useEcomStore((state)=>state.user)
    const token = useEcomStore((state)=>state.token)


    useEffect(()=>{
        if(user && token){
            // send req to backend
            currentAdmin(token) // ถ้า current ทำงานสำเร็จจะทำ then
            .then((res)=>setOk(true))
            .catch((err)=>setOk(false))
        }
    },[])

    return ok ?  element : <LoadingToRedirect />
}

export default ProtectRouteAdmin