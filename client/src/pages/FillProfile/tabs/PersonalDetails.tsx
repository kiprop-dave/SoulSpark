import { useCallback, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { personalInfoSchema, PersonalInfo, Image } from '@/types';
import { Button } from '@/components/ui/button';
import ImageUpload from '../components/ImageUpload';
import OptionSelect from '@/components/OptionSelect';

interface PersonalDetailsProps {
  nextStep: () => void;
  setPersonalDetails: (details: PersonalInfo) => void;
  initialInfo?: PersonalInfo;
}

export default function PersonalDetailsTab({
  nextStep,
  initialInfo,
  setPersonalDetails,
}: PersonalDetailsProps): JSX.Element {
  const resetForm = useCallback((info?: PersonalInfo): PersonalInfo => {
    return {
      images: (function (): Image[] {
        if (info?.images) {
          return [
            ...info.images,
            ...new Array<Image>(9 - info.images.length).fill({
              type: '',
              url: '',
              resource_type: '',
              public_id: '',
              format: '',
              asset_id: '',
              secure_url: '',
            }),
          ];
        } else {
          return new Array<Image>(9).fill({
            type: '',
            url: '',
            resource_type: '',
            public_id: '',
            format: '',
            asset_id: '',
            secure_url: '',
          });
        }
      })(),
      first_name: info?.first_name || '',
      last_name: info?.last_name || '',
      gender: info?.gender || 'PreferNotToSay',
      dateOfBirth: info?.dateOfBirth || new Date(),
    };
  }, []);

  const {
    formState: { errors },
    setValue,
    handleSubmit,
    register,
    watch,
    reset,
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: useMemo(() => resetForm(initialInfo), [initialInfo]),
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (initialInfo) {
      reset(resetForm(initialInfo));
    }
  }, [initialInfo]);

  const genderOptions = useMemo(() => ['Male', 'Female', 'Other', 'Prefer not to say'], []);

  const currentGender = watch('gender');

  const selectGender = (property: string, value: string) => {
    // Convert the value to the correct database format
    if (value === 'Prefer not to say') value = 'PreferNotToSay';
    //@ts-ignore
    setValue(property, value);
  };

  const images = watch('images');

  console.log(initialInfo);

  // Insert the image into the first empty slot in the array
  const setImages = (value: Image) => {
    const newImages = [...images];
    for (let i = 0; i < newImages.length; i++) {
      if (newImages[i].secure_url.length === 0) {
        newImages[i] = value;
        break;
      }
    }
    setValue('images', newImages);
  };

  const onSubmit: SubmitHandler<PersonalInfo> = (data) => {
    setPersonalDetails({ ...data, images: data.images.filter((img) => img.secure_url.length > 0) });
    nextStep();
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-black">Fill in your personal details</h1>
      <form className="w-full flex flex-col gap-2 my-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex flex-col">
          <label htmlFor="images" className="text-sm font-bold text-slate-500">
            Upload your images
          </label>
          {errors.images && <span className="text-red-500 text-sm">{errors.images.message}</span>}
          <div className="w-full grid grid-cols-3 gap-2">
            {images.map((img, i) => {
              return (
                <ImageUpload existingImage={img} setImages={setImages} key={`${i}-${img.url}`} />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="first_name" className="text-sm font-bold text-slate-500">
            First Name
          </label>
          {errors.first_name && (
            <span className="text-red-500 text-sm">{errors.first_name.message}</span>
          )}
          <input
            className="w-full p-2 border border-red-200 outline-red-500 focus:ring-1 focus:ring-red-500 rounded font-sans text-sm"
            type="text"
            id="first_name"
            {...register('first_name')}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="last_name" className="text-sm font-bold text-slate-500">
            Last Name
          </label>
          {errors.last_name && (
            <span className="text-red-500 text-sm">{errors.last_name.message}</span>
          )}
          <input
            className="w-full p-2 border border-red-200 outline-red-500 focus:ring-1 focus:ring-red-500 rounded font-sans text-sm"
            type="text"
            id="last_name"
            {...register('last_name')}
          />
        </div>
        <div>
          <label htmlFor="gender" className="text-sm font-bold text-slate-500">
            Select your gender
          </label>
          {errors.gender && <span className="text-red-500 text-sm">This field is required</span>}
          <div className="w-full flex flex-wrap gap-2 my-2">
            {genderOptions.map((gender, index) => {
              return (
                <OptionSelect
                  key={index}
                  option={gender}
                  property="gender"
                  selectOption={selectGender}
                  isSelected={gender === currentGender}
                />
              );
            })}
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="dateOfBirth" className="text-sm font-bold text-slate-500">
            Date of Birth
          </label>
          {errors.dateOfBirth && (
            <span className="text-red-500 text-sm">{errors.dateOfBirth.message}</span>
          )}
          <input
            type="date"
            id="dateOfBirth"
            {...register('dateOfBirth')}
            className="w-full p-2 border border-red-200 outline-red-500 focus:ring-1 focus:ring-red-500 rounded font-sans text-sm cursor-pointer"
          />
        </div>
        <Button
          type="submit"
          className="w-full mt-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600"
        >
          Continue
        </Button>
      </form>
    </div>
  );
}
