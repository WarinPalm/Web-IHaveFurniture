import axios from 'axios'

export const getAllCategory = async () =>{
    return axios.get("http://localhost:3000/api/categories");
}
export const createCategory = async (token, form) => {

    return axios.post('http://localhost:3000/api/category', form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const removeCategory = async (token, id) => {

    return axios.delete(`http://localhost:3000/api/category/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const editCategory = async (token, id, form)=>{
    return axios.put(`http://localhost:3000/api/edit-category/${id}`, form,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
}
