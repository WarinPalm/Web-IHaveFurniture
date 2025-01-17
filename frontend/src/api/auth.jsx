import axios from 'axios';



export const currentUser = async (token) => {
    return await axios.post('http://localhost:3000/api/current-user',{}, {
        headers:{
            Authorization: `Bearer ${token}`,
        },
    });
};


// {} คือมี return
export const currentAdmin = async (token) => {
    return await axios.post('http://localhost:3000/api/current-admin',{},{
        headers:{
            Authorization: `Bearer ${token}`,
        },
    })
}




