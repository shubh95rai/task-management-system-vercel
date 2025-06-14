import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

// USING MULTER STORAGE CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const originalName = file.originalname.split(".")[0]; // filename without extension
    const customPublicId = originalName;

    return {
      folder: "task-management-system", // folder name in cloudinary
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: customPublicId, // Static public_id => will overwrite duplicates if already exists in cloudinary
      overwrite: true, // Optional, ensures overwriting
    };
  },
});

const upload = multer({ storage });

export default upload;
