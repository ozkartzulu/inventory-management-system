import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Usa HTTPS
});

export async function uploadImageToCloudinary(image: Buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "lubris" }, // Carpeta donde se guardarán las imágenes
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(image);
  });
}