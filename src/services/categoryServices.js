// services/categoryServices.js
import api from "./api";

export const fetchCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createCategory = async (payload) => {
  try {
    const response = await api.post("/categories", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const toggleCategory = async (id, isActive) => {
  try {
    const response = await api.patch(`/categories/${id}`, { isActive });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};