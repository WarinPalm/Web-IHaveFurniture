import axios from "axios";

export const fetchOrders = (token) =>{
    return axios.get('http://localhost:3000/api/orders',{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
}
export const fetchHistory = (token) =>{
    return axios.get('http://localhost:3000/api/history',{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
}
export const submitPayment =(token, id, form) =>{
    return axios.put(`http://localhost:3000/api/payment/${id}`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const cancleOrder =(token, id) =>{
    return axios.put(`http://localhost:3000/api/cancel/${id}`,{},{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

