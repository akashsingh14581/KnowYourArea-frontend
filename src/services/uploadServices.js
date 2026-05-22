import api from "./api";

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data.url;
  } catch (error) {
    console.error("Upload error:", error);
    throw error.response?.data?.message || "File upload failed";
  }
};

export const uploadMultipleFiles = async (files, onProgress) => {
  try {
    const uploadedUrls = [];
    
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i]);
      uploadedUrls.push(url);
      
      if (onProgress) {
        onProgress(Math.round(((i + 1) / files.length) * 100));
      }
    }
    
    return uploadedUrls;
  } catch (error) {
    throw error;
  }
};