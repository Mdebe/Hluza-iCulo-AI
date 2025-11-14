import axios from "axios";

const API_URL = "http://localhost:8000";

export const uploadAudio = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_URL}/separate`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
