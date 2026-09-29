import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (cloud_name && api_key && api_secret && cloud_name !== "your_cloud_name") {
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
    });
    console.log("☁️ Cloudinary configured successfully.");
  } else {
    console.warn("⚠️ Cloudinary credentials are not fully configured. Image uploads will use fallback storage or mock URLs.");
  }
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder = "portfolio_cms",
  resource_type: "auto" | "image" | "raw" = "auto"
): Promise<{ secure_url: string; public_id: string; width?: number; height?: number; format?: string }> {
  configureCloudinary();
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function deleteFromCloudinary(public_id: string): Promise<boolean> {
  if (!public_id) return false;
  try {
    configureCloudinary();
    const res = await cloudinary.uploader.destroy(public_id);
    return res.result === "ok";
  } catch (err) {
    console.error("Error deleting asset from Cloudinary:", err);
    return false;
  }
}
