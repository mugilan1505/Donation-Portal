import axios from 'axios';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dhaykeij2/image/upload';
const UPLOAD_PRESET = 'ml_default'; // or your actual unsigned preset

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await axios.post(CLOUDINARY_URL, formData);
  return response.data.secure_url; // This is the public image URL
};

try {
  await initializePayment(amount, fundraiserId, {
    name: donorName,
    email: donorEmail,
    phone: donorPhone
  });
} catch (error) {
  // Handle error
} 