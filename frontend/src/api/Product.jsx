import axios from "axios";

export const getAllProducts = async () =>{
  return axios.get("http://localhost:3000/api/products");
}
export const createProduct = async (token, form) => {

  return axios.post("http://localhost:3000/api/product", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteProduct = async (token, id) => {
    // code body
    return axios.delete(`http://localhost:3000/api/product-del/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
export const editProduct = async (token, id, form) => {
    // code body
    return axios.put(`http://localhost:3000/api/product-edit/${id}`, form, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};