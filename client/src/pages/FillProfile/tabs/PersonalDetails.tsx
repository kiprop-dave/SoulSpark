import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { personalInfoSchema, PersonalInfo, PersonalInfoNoImages } from '@/types';
import { Button } from '@/components/ui/button';
import ImageUpload from '../components/ImageUpload';
import OptionSelect from '@/components/OptionSelect';

interface PersonalDetailsProps {
  nextStep: () => void;
  setPersonalDetails: (details: PersonalInfoNoImages) => void;
  initialInfo?: PersonalInfo;
}

export default function PersonalDetailsTab({ nextStep, initialInfo }: PersonalDetailsProps): JSX.Element {
  const { formState: { errors }, setValue, handleSubmit, register, watch } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      ...initialInfo,
      images: function() {
        if (initialInfo?.images) {
          return [...initialInfo.images, ...new Array<string>(9 - initialInfo.images.length).fill('')];
        } else {
          return new Array<string>(9).fill('');
        }
      }()
    },
    mode: 'onSubmit'
  });

  const genderOptions = useMemo(() => [
    "Male",
    "Female",
    "Other",
    "Prefer not to say"
  ], []);

  const currentGender = watch("gender");

  const selectGender = (property: string, value: string) => {
    //@ts-ignore
    setValue(property, value)
  };

  const images = watch("images");

  // Find the inserted image and move it to the first empty slot and update the images array
  const setImages = (index: number, value: string) => {
    const newImages = [...images];
    for (let i = 0; i < newImages.length; i++) {
      let j: number = i;
      if (newImages[i].length === 0) {
        for (j = i + 1; j < newImages.length; j++) {
          if (j === index) {
            newImages[i] = value;
            newImages[j] = '';
            j++;
            break;
          }
        }
      }
      if (j >= newImages.length) break;
    }
    setValue("images", newImages);
  };

  const onSubmit: SubmitHandler<PersonalInfo> = (data) => {
    console.log(data);
  }


  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-black">Fill in your personal details</h1>
      <form className='w-full flex flex-col gap-2 my-2' onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex flex-col">
          <label htmlFor="images" className='text-sm font-bold text-slate-500'>Upload your images</label>
          {errors.images && <span className='text-red-500 text-sm'>{errors.images.message}</span>}
          <div className='w-full grid grid-cols-3 gap-2'>
            {
              images.map((img, i) => {
                return (
                  <ImageUpload
                    key={i}
                    existingImage={img}
                    setImages={setImages}
                    index={i}
                  />
                )
              })
            }
          </div>
        </div>
        <div className='flex flex-col'>
          <label htmlFor="first_name" className='text-sm font-bold text-slate-500'>First Name</label>
          {errors.first_name && <span className='text-red-500 text-sm'>{errors.first_name.message}</span>}
          <input
            className="w-full p-2 border border-red-200 outline-red-500 focus:ring-1 focus:ring-red-500 rounded font-sans text-sm"
            type="text"
            id="first_name"
            {...register('first_name')}
          />
        </div>
        <div className='flex flex-col'>
          <label htmlFor="last_name" className='text-sm font-bold text-slate-500'>Last Name</label>
          {errors.last_name && <span className='text-red-500 text-sm'>{errors.last_name.message}</span>}
          <input
            className="w-full p-2 border border-red-200 outline-red-500 focus:ring-1 focus:ring-red-500 rounded font-sans text-sm"
            type="text"
            id="last_name"
            {...register('last_name')}
          />
        </div>
        <div>
          <label htmlFor="gender" className='text-sm font-bold text-slate-500'>Select your gender</label>
          {errors.gender && <span className='text-red-500 text-sm'>This field is required</span>}
          <div className='w-full flex flex-wrap gap-2 my-2'>
            {
              genderOptions.map((gender, index) => {
                return (
                  <OptionSelect
                    key={index}
                    option={gender}
                    property='gender'
                    selectOption={selectGender}
                    isSelected={gender === currentGender}
                  />
                )
              })
            }
          </div>
        </div>
        <div className='w-full flex flex-col gap-2'>
          <label htmlFor="dateOfBirth" className='text-sm font-bold text-slate-500'>Date of Birth</label>
          {errors.dateOfBirth && <span className='text-red-500 text-sm'>{errors.dateOfBirth.message}</span>}
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
