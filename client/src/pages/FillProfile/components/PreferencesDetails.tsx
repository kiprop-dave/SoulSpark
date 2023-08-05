import { useState } from 'react';
import ProfileNavigation from '@/components/ProfileNavigation';
import { Preferences, preferencesSchema } from '@/types';

interface PreferencesDetailsProps {
  prevStep: () => void;
  initialInfo: Preferences;
}

export default function PreferencesDetailsTab({
  prevStep,
  initialInfo,
}: PreferencesDetailsProps): JSX.Element {
  const [preferences, setPreferences] = useState<Preferences>(initialInfo);

  return (
    <div className="w-full">
      <ProfileNavigation prevStep={prevStep} />
      <h1 className="text-2xl font-bold text-black mt-4">Fill in your preferences</h1>
    </div>
  );
}
