// This file has functions for uploading digital assets to the cloud provider.
import axios from 'axios';
import { imageSchema } from '@/types';

const url = 'https://api.cloudinary.com/v1_1/da1ehipve/image/upload';

export async function uploadImage(formData: FormData) {
  const uploadPreset = 'qfbtmcvf';
  formData.append('upload_preset', uploadPreset);
  try {
    const { data } = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return imageSchema.parse(data);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to upload image.');
  }
}
