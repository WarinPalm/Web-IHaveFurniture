import axios from "axios";

export const infoAboutMe = async (token) => {
    return await axios.get('http://localhost:3000/api/profile', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
};
export const updateUserInfo = async (token, form) => {
    return await axios.put('http://localhost:3000/api/edit-profile', form, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
};