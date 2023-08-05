import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { personalInfoSchema, PersonalInfo, UserProfile, PersonalInfoNoImages } from '@/types';
import ProfileNavigation from '@/components/ProfileNavigation';

interface PersonalDetailsProps {
  nextStep: () => void;
  setPersonalDetails: (details: PersonalInfoNoImages) => void;
  setImages: (imageurls: string[]) => void;
}

export default function PersonalDetailsTab({ nextStep }: PersonalDetailsProps): JSX.Element {
  return (
    <div className="w-full">
      <ProfileNavigation nextStep={nextStep} />
      <h1 className="text-2xl font-bold text-black mt-4">Fill in your personal details</h1>
      <div className="py-2 w-full">Images upload goes here</div>
    </div>
  );
}
