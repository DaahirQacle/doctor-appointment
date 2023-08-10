import dotenv from 'dotenv';
import cloudinaryModule from 'cloudinary';

dotenv.config();

const cloudinary = cloudinaryModule.v2;

cloudinary.config({
  cloud_name: 'ds4icqw4q',
  api_key: '414363994522488',
  api_secret: 't2GUG9jWAxw28vE5mZbDvXYAT_w'
});

export default cloudinary;