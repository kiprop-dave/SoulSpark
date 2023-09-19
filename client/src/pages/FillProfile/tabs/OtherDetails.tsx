import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { OtherInfo, otherInfoSchema } from '@/types';
import ProfileNavigation from '@/components/ProfileNavigation';
import OptionSelect from '@/components/OptionSelect';
import { ZodError } from 'zod';

interface OtherDetailsTabProps {
  nextStep: () => void;
  prevStep: () => void;
  initialValues?: OtherInfo;
  confirmStep: (details: OtherInfo) => void;
}

export default function OtherDetailsTab({
  nextStep,
  prevStep,
  initialValues,
  confirmStep,
}: OtherDetailsTabProps): JSX.Element {
  const [otherInfo, setOtherInfo] = useState<OtherInfo>(
    initialValues || {
      interests: [],
      diet: '',
      smoking: '',
      drinking: '',
      pets: '',
      socialMediaActivity: '',
    }
  );

  const dietOptions = useMemo(
    () => [
      'Omnivore',
      'Vegetarian',
      'Vegan',
      'Kosher',
      'Halal',
      'Other',
      'Carnivore',
      'Pescatarian',
    ],
    []
  );

  const smokingOptions = useMemo(() => ['Non-smoker', 'Smoker', 'Trying to quit', 'Socially'], []);

  const drinkingOptions = useMemo(
    () => ['Not for me', 'Sober', 'On special occasions', 'Socially', 'Regularly'],
    []
  );

  const petsOptions = useMemo(
    () => ['Dog', 'Cat', 'Allergic to pets', 'Other', "Don't have but love", 'Fish', 'Want a pet'],
    []
  );

  const socialMediaActivityOptions = useMemo(
    () => ['Off the grid', 'Influencer', 'Socially active', 'Passive scroller'],
    []
  );

  const interestsOptions = useMemo(
    () => [
      //TODO: Add more interests, maybe from a database? and icons
      'Art',
      'Books',
      'Cars',
      'Cooking',
      'Dancing',
      'Fashion',
      'Fitness',
      'Gaming',
      'Movies & TV',
      'Music',
      'Photography',
      'Politics',
      'Sports',
      'Technology',
      'Traveling',
      'Writing',
      'Anime',
    ],
    []
  );

  const handleChoice = (key: string, choice: string) => {
    setOtherInfo((prev) => ({ ...prev, [key]: choice }));
  };

  const handleMultiChoice = (key: string, choice: string) => {
    if (key in otherInfo) {
      const property = key as keyof OtherInfo;
      const prevChoices = otherInfo[property] as string[];
      if (prevChoices.includes(choice)) {
        setOtherInfo((prev) => ({ ...prev, [key]: prevChoices.filter((c) => c !== choice) }));
      } else {
        setOtherInfo((prev) => ({ ...prev, [key]: [...prevChoices, choice] }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const validated = otherInfoSchema.parse(otherInfo);
      confirmStep(validated);
      nextStep();
    } catch (err) {
      if (err instanceof ZodError) {
        //TODO:Add a toast to show the error
        console.log(err);
      }
    }
  };

  return (
    <div className="w-full">
      <ProfileNavigation nextStep={nextStep} prevStep={prevStep} />
      <h1 className="text-2xl font-bold text-black mt-4">Fill in your interests and lifestyle</h1>
      <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
        <div className="w-full mt-4">
          <label htmlFor="interests" className="text-sm font-bold text-slate-500">
            What are your interests?
          </label>
          <div className="flex flex-wrap w-full mt-2 gap-2">
            {interestsOptions.map((interest, i) => {
              return (
                <OptionSelect
                  key={`${i}${interest}`}
                  option={interest}
                  isSelected={otherInfo?.interests?.includes(interest)}
                  property="interests"
                  selectOption={handleMultiChoice}
                  isMulti
                />
              );
            })}
          </div>
        </div>
        <div className="w-full mt-4">
          <label htmlFor="pets" className="text-sm font-bold text-slate-500">
            Do you have any pets?
          </label>
          <div className="flex flex-wrap w-full mt-2 gap-2">
            {petsOptions.map((pet, i) => {
              return (
                <OptionSelect
                  key={`${i}${pet}`}
                  option={pet}
                  isSelected={otherInfo.pets === pet}
                  property="pets"
                  selectOption={handleChoice}
                />
              );
            })}
          </div>
        </div>
        <div className="w-full mt-4">
          <label htmlFor="drinking" className="text-sm font-bold text-slate-500">
            How often do you drink?
          </label>
          <div className="flex flex-wrap w-full mt-2 gap-2">
            {drinkingOptions.map((drink, i) => {
              return (
                <OptionSelect
                  key={`${i}${drink}`}
                  option={drink}
                  isSelected={otherInfo.drinking === drink}
                  property="drinking"
                  selectOption={handleChoice}
                />
              );
            })}
          </div>
        </div>
        <div className="w-full mt-4">
          <label htmlFor="smoking" className="text-sm font-bold text-slate-500">
            How often do you smoke?
          </label>
          <div className="flex flex-wrap w-full mt-2 gap-2">
            {smokingOptions.map((smoke, i) => {
              return (
                <OptionSelect
                  key={`${i}${smoke}`}
                  option={smoke}
                  isSelected={otherInfo.smoking === smoke}
                  property="smoking"
                  selectOption={handleChoice}
                />
              );
            })}
          </div>
        </div>
        <div className="w-full mt-4">
          <label htmlFor="diet" className="text-sm font-bold text-slate-500">
            What are your dietary preferences?
          </label>
          <div className="flex flex-wrap w-full mt-2 gap-2">
            {dietOptions.map((diet, i) => {
              return (
                <OptionSelect
                  key={`${i}${diet}`}
                  option={diet}
                  isSelected={otherInfo.diet === diet}
                  property="diet"
                  selectOption={handleChoice}
                />
              );
            })}
          </div>
        </div>
        <div className="w-full mt-4">
          <label htmlFor="socialMediaActivity" className="text-sm font-bold text-slate-500">
            How active are you on social media?
          </label>
          <div className="flex flex-wrap w-full mt-2 gap-2">
            {socialMediaActivityOptions.map((activity, i) => {
              return (
                <OptionSelect
                  key={`${i}${activity}`}
                  option={activity}
                  isSelected={otherInfo.socialMediaActivity === activity}
                  property="socialMediaActivity"
                  selectOption={handleChoice}
                />
              );
            })}
          </div>
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
