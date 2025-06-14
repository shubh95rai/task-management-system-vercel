import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

export default async function uploadImage(imageFile) {
  const formData = new FormData();

  // append image file to form data
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // set header for file upload
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error uploading the image", error.message);
    throw error; // rethrow error for handling
  }
}
