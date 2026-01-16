const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

exports.uploadImage = async (files) => {
  const fileArray = Object.values(files);
  const results = [];

  for (const file of fileArray) {
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "products",
      });
      results.push(result);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return results;
};