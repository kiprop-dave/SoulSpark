import { useReducer, useState } from 'react';
import { UserProfile, PersonalInfo, BasicInfo, OtherInfo, Preferences } from '@/types';

export function useProfileDetails() {
  const [profileDetails, setProfileDetails] = useState<UserProfile>({
    personalInfo: {
      first_name: '',
      last_name: '',
      dateOfBirth: new Date(),
      gender: 'PreferNotToSay',
      images: [],
    },
    preferences: {
      lookingFor: '',
      attraction: '',
      ageRange: {
        min: 18,
        max: 100,
      },
    },
  });

  const setPersonalDetails = (info: PersonalInfo) => {
    setProfileDetails((prev) => ({ ...prev, personalInfo: info }));
  };

  const setBasicDetails = (info: BasicInfo) => {
    setProfileDetails((prev) => ({ ...prev, basicInfo: info }));
  };

  const setOtherDetails = (info: OtherInfo) => {
    setProfileDetails((prev) => ({ ...prev, otherInfo: info }));
  };

  const setPreferences = (info: Preferences) => {
    setProfileDetails((prev) => ({ ...prev, preferences: info }));
  };

  const setAllDetails = (details: UserProfile) => {
    setProfileDetails(details);
  };

  return {
    profileDetails,
    setAllDetails,
    setPersonalDetails,
    setBasicDetails,
    setOtherDetails,
    setPreferences,
  };
}
