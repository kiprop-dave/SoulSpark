import { useMemo, useState } from 'react';
import { ZodError } from 'zod';
import { Button } from '@/components/ui/button';
import { BasicInfo, basicInfoSchema } from '@/types';
import OptionSelect from '@/components/OptionSelect';
import ProfileNavigation from '@/components/ProfileNavigation';

interface BasicDetailsTabProps {
  initialInfo?: BasicInfo;
  nextStep: () => void;
  prevStep: () => void;
  confirmStep: (basicInfo: BasicInfo) => void;
}

export default function BasicDetailsTab({
  nextStep,
  prevStep,
  confirmStep,
  initialInfo,
}: BasicDetailsTabProps): JSX.Element {
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(
    initialInfo || {
      bio: '',
      occupation: '',
      education: '',
      zodiac: '',
      languages: [],
    }
  );

  const educationLevels = useMemo(
    () => ['High School', 'In College', 'Bachelors', 'Masters', 'PhD', 'Trade School'],
    []
  );

  const zodiacSigns = useMemo(
    () => [
      'Aries',
      'Taurus',
      'Gemini',
      'Cancer',
      'Leo',
      'Virgo',
      'Libra',
      'Scorpio',
      'Sagittarius',
      'Capricorn',
      'Aquarius',
      'Pisces',
    ],
    []
  );

  const languages = useMemo(
    () => [
      // TODO:Use an api to get all languages
      'English',
      'Spanish',
      'French',
      'German',
      'Italian',
      'Portuguese',
      'Chinese',
      'Swahili',
    ],
    []
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const validated = basicInfoSchema.parse(basicInfo);
      confirmStep(validated);
      nextStep();
    } catch (err) {
      if (err instanceof ZodError) {
        //TODO:Add a toast to show the error
        console.log(err);
      }
    }
    confirmStep(basicInfo);
  };

  const handleBioOrOccupation = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSingleOption = (property: string, option: string) => {
    setBasicInfo((prev) => ({ ...prev, [property]: option }));
  };

  const handleMultipleOptions = (property: string, option: string) => {
    if (basicInfo && property in basicInfo) {
      const key = property as keyof BasicInfo;
      const options = basicInfo[key] as string[];
      if (options.includes(option)) {
        const newOptions = options.filter((opt) => opt !== option);
        setBasicInfo((prev) => ({ ...prev, [property]: newOptions }));
      } else {
        setBasicInfo((prev) => ({ ...prev, [property]: [...options, option] }));
      }
    }
  };

  return (
    <div className="w-full">
      <ProfileNavigation prevStep={prevStep} nextStep={nextStep} />
      <h1 className="text-2xl font-bold text-black mt-4">Fill in some basic details</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col items-start justify-start w-full mt-4">
          <label htmlFor="bio" className="text-sm font-bold text-slate-500">
            Bio
          </label>
          <textarea
            id="bio"
            className="w-full p-2 h-32 border border-red-200 outline-red-500 focus:ring-1 focus:ring-red-500 rounded font-sans text-sm"
            placeholder="Write something about yourself"
            name="bio"
            value={basicInfo?.bio}
            onChange={handleBioOrOccupation}
          />
        </div>
        <div className="w-full mt-4">
          <label htmlFor="languages" className="text-sm font-bold text-slate-500">
            Languages
          </label>
          <div className="flex flex-wrap w-full mt-2 gap-2">
            {languages.map((lang, i) => {
              return (
                <OptionSelect
                  key={`${i}${lang}`}
                  option={lang}
                  isSelected={basicInfo?.languages?.includes(lang)}
                  property="languages"
                  selectOption={handleMultipleOptions}
                  isMulti
                />
              );
            })}
          </div>
        </div>
        <div className="w-full mt-4">
          <label htmlFor="zodiac" className="text-sm font-bold text-slate-500">
            Zodiac
          </label>
          <div className="flex flex-wrap w-full mt-2 gap-2">
            {zodiacSigns.map((sign) => {
              return (
                <OptionSelect
                  key={sign}
                  option={sign}
                  isSelected={basicInfo?.zodiac === sign}
                  selectOption={handleSingleOption}
                  property="zodiac"
                />
              );
            })}
          </div>
        </div>
        <div className="w-full mt-4">
          <label htmlFor="education" className="text-sm font-bold text-slate-500">
            What is your education level?
          </label>
          <div className="flex flex-wrap w-full mt-2 gap-2">
            {educationLevels.map((level) => {
              return (
                <OptionSelect
                  key={level}
                  option={level}
                  isSelected={basicInfo?.education === level}
                  property="education"
                  selectOption={handleSingleOption}
                />
              );
            })}
          </div>
        </div>
        <div className="w-full mt-4">
          <label htmlFor="occupation" className="text-sm font-bold text-slate-500">
            Occupation
          </label>
          <input
            id="occupation"
            placeholder="What do you do?"
            type="text"
            value={basicInfo?.occupation}
            name="occupation"
            onChange={handleBioOrOccupation}
            className="w-full p-2 border border-red-200 outline-red-500 focus:ring-1 focus:ring-red-500 rounded font-sans text-sm"
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
