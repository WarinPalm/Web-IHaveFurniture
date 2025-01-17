import axios from "axios";

export const addProductToCart = async (token, form) =>{
    return axios.post('http://localhost:3000/api/item-cart', form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const getAllCart = async (token)=>{
    return axios.get('http://localhost:3000/api/cart',{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
}
export const deleteProduct = async (token, id) => {
    return axios.delete(`http://localhost:3000/api/item-cart/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export const buyProducts = async (token) =>{
    return axios.post('http://localhost:3000/api/submit-cart',{},{
        headers:{
            Authorization: `Bearer ${token}`,
        }
    });
}

