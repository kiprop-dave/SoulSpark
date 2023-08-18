import { useState } from 'react';
import { BiSolidImageAdd } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import { Image } from '@/types';
import { uploadImage } from '@/api/digitalAsset';

interface ImageUploadProps {
  existingImage: Image;
  setImages: (value: Image) => void;
}

export default function ImageUpload({ existingImage, setImages }: ImageUploadProps): JSX.Element {
  const [_, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(existingImage.secure_url);
  const [deleteImage, setDeleteImage] = useState<boolean>(false);

  const validpreviewUrl = preview.length > 0;

  // This should validate the image size and upload it.
  // The server should return the url of the image.
  // The url should then be stored in the user's profile in the parent component.
  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size <= 1024 * 1024 * 1024 * 2) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
        const formData = new FormData();
        formData.append('file', file);
        uploadImage(formData).then((res) => {
          console.log(res.secure_url);
          setImages(res);
        });
      }
    }
  };

  const handleImageDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setImage(null);
    setPreview('');
  };

  return (
    <div className="flex border-2 border-slate-500 border-dashed w-full h-36 rounded relative">
      {!validpreviewUrl ? (
        <div className="w-8 h-8 absolute bottom-0 right-0">
          <label
            htmlFor="image"
            className="w-full h-full flex items-center justify-center cursor-pointer"
          >
            <BiSolidImageAdd className="text-slate-500 w-full h-full" />
          </label>
          <input type="file" id="image" className="hidden" onChange={handleImageInput} />
        </div>
      ) : (
        <div
          className="w-full h-full relative"
          onMouseEnter={() => setDeleteImage(true)}
          onMouseLeave={() => setDeleteImage(false)}
        >
          <img src={preview} alt="profile" className="w-full h-full object-cover" />
          {deleteImage && (
            <button
              className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-xl bg-red-500"
              onClick={handleImageDelete}
            >
              <AiFillDelete className="text-white w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
