import { useState } from 'react';
import { Image } from '@/types';
import { BsCloudUpload } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import { uploadImage } from '@/api/digitalAsset';

type ImagePickerGalleryProps = {
  onSelect: (image: Image) => void;
};

export default function ImagePickerGallery({ onSelect }: ImagePickerGalleryProps): JSX.Element {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageSafeForWork, setImageSafeForWork] = useState<boolean>(true);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageLoaded(true);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    URL.revokeObjectURL(previewUrl); // free memory
    setImageFile(null);
    setImageLoaded(false);
    setPreviewUrl('');
    setImageSafeForWork(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      uploadImage(formData).then((image) => {
        handleCancel(); // Maybe useEffect for unmounting
        onSelect(image);
      });
    }
  };

  return (
    <div className="w-full h-[16rem] flex bg-white dark:bg-neutral-800 border-t border-t-slate-300 dark:border-t-gray-700">
      <form onSubmit={(e) => handleSubmit(e)} className="w-full h-full p-1 flex gap-2 items-center">
        <div className="w-1/3 h-full flex items-center justify-center rounded-lg">
          {imageLoaded ? (
            <div className="w-full h-full relative">
              <button
                type="button"
                aria-label="Remove image"
                className="absolute top-0 right-0 p-1 bg-gray-700 dark:bg-gray-400 rounded-full"
                onClick={() => handleCancel()}
              >
                <MdOutlineCancel className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </button>
              <img
                src={previewUrl}
                alt="preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : (
            <label className="w-full h-full flex items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 cursor-pointer">
              <input
                aria-label="Upload an image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
              />
              <BsCloudUpload className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </label>
          )}
        </div>
        {imageLoaded && (
          <div className="w-1/3 h-full flex flex-col justify-center gap-2">
            <label
              htmlFor="safeForWork"
              className="text-sm text-gray-500 dark:text-gray-400 flex gap-2"
            >
              <input
                type="checkbox"
                id="safeForWork"
                name="safeForWork"
                checked={imageSafeForWork}
                onChange={() => setImageSafeForWork(!imageSafeForWork)}
              />
              Is this image safe for work?
            </label>
            <button
              type="submit"
              className="mt-2 w-full px-4 lg:px-6 py-2 bg-red-500 dark:bg-red-400 text-white font-semibold rounded-3xl"
            >
              Send
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
