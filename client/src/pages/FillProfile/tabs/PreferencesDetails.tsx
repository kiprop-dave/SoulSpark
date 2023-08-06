import { useMemo, useState } from 'react';
import { Preferences, preferencesSchema } from '@/types';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import ProfileNavigation from '@/components/ProfileNavigation';
import OptionSelect from '@/components/OptionSelect';
import { ZodError } from 'zod';

interface PreferencesDetailsProps {
  prevStep: () => void;
  initialInfo: Preferences;
  completeProfile: (info: Preferences) => void;
}

export default function PreferencesDetailsTab({
  prevStep,
  initialInfo,
  completeProfile,
}: PreferencesDetailsProps): JSX.Element {
  const [preferences, setPreferences] = useState<Preferences>(initialInfo);

  const lookingForOptions = useMemo(
    () => [
      'Long term partner',
      'Long term,open to short term',
      'Short term,open to long term',
      'Short term fun',
      'New friends',
      'Still figuring it out',
    ],
    []
  );

  const attractionOptions = useMemo(() => ['Man', 'Woman', 'Other', 'All'], []);

  const handleSelectOption = (property: string, option: string) => {
    setPreferences({ ...preferences, [property]: option });
  };

  const handleAgeRangeChange = (values: number[]) => {
    setPreferences((prev) => ({ ...prev, ageRange: { min: values[0], max: values[1] } }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const validated = preferencesSchema.parse(preferences);
      completeProfile(validated);
    } catch (err) {
      if (err instanceof ZodError) {
        console.log(err);
      }
    }
  };

  return (
    <div className="w-full">
      <ProfileNavigation prevStep={prevStep} />
      <h1 className="text-2xl font-bold text-black mt-4">Fill in your preferences</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="w-full mt-4">
          <label className="text-sm font-bold text-slate-500">What are you looking for?</label>
          <div className="flex flex-wrap mt-2 gap-2">
            {lookingForOptions.map((option, index) => {
              return (
                <OptionSelect
                  key={index}
                  option={option}
                  selectOption={handleSelectOption}
                  isSelected={option === preferences.lookingFor}
                  property="lookingFor"
                />
              );
            })}
          </div>
        </div>
        <div className="w-full mt-4">
          <label className="text-sm font-bold text-slate-500">Who are you attracted to?</label>
          <div className="flex flex-wrap mt-2 gap-2">
            {attractionOptions.map((option, index) => {
              return (
                <OptionSelect
                  key={index}
                  option={option}
                  selectOption={handleSelectOption}
                  isSelected={option === preferences.attraction}
                  property="attraction"
                />
              );
            })}
          </div>
        </div>
        <div className="w-full mt-4">
          <div className="w-full flex items-center justify-between">
            <label className="text-sm font-bold text-slate-500">What is your age preference?</label>
            <span className="text-sm font-bold text-slate-600">
              {`${preferences.ageRange.min} - ${preferences.ageRange.max}`}
            </span>
          </div>
          <div className="my-3">
            <Slider
              value={[preferences.ageRange.min, preferences.ageRange.max]}
              defaultValue={[18, 100]}
              min={18}
              max={100}
              onValueChange={(values) => handleAgeRangeChange(values)}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full mt-5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600"
        >
          Save profile details
        </Button>
      </form>
    </div>
  );
}
