import axios from "axios";

export const fetchCustomerOrder = async (token)=>{
    return await axios.get('http://localhost:3000/api/admin/list-orders', {
        headers:{
            Authorization: `Bearer ${token}`,
        },
    });
}
export const changeStatusOrder = async (token, id, form)=>{
    return await axios.put(`http://localhost:3000/api/admin/status-order/${id}`, form, {
        headers:{
            Authorization: `Bearer ${token}`,
        },
    });
}
export const fetchAllUser = async (token)=>{
    return await axios.get('http://localhost:3000/api/admin/list-users', {
        headers:{
            Authorization: `Bearer ${token}`,
        },
    });
}