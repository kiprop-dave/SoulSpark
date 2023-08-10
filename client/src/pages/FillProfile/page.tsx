import { useEffect } from 'react';
import { createUserProfile } from '@/api/user';
import { useDetailsPagination, InfoTab } from '@/hooks/useDetailsPagination';
import { useProfileDetails, } from '@/hooks/useProfileDetails';
import { BasicInfo, LoggedInUser, OtherInfo, PersonalInfo, Preferences, UserProfile } from '@/types';
import AuthWrapper from '@/components/wrappers/AuthWrapper';
import PersonalDetailsTab from './tabs/PersonalDetails';
import BasicDetailsTab from './tabs/BasicDetails';
import OtherDetailsTab from './tabs/OtherDetails';
import PreferencesDetailsTab from './tabs/PreferencesDetails';
import { useUserProfile } from '@/context/UserProfileContext';

interface ChooseTabProps {
  currentTab: InfoTab
  nextTab: () => void
  prevTab: () => void
  profile: UserProfile
  setPersonalDetails: (p: PersonalInfo) => void
  setBasicDetails: (b: BasicInfo) => void
  setOtherDetails: (o: OtherInfo) => void
  setPreferences: (p: Preferences) => void
}

const ChooseTab = ({
  currentTab,
  setPersonalDetails,
  setOtherDetails,
  profile,
  nextTab,
  prevTab,
  setBasicDetails,
  setPreferences
}: ChooseTabProps): JSX.Element => {
  switch (currentTab) {
    case 'personal':
      return (
        <PersonalDetailsTab
          nextStep={nextTab}
          initialInfo={profile.personalInfo}
          setPersonalDetails={setPersonalDetails}
        />
      );
    case 'basic':
      return (
        <BasicDetailsTab
          prevStep={prevTab}
          nextStep={nextTab}
          confirmStep={setBasicDetails}
          initialInfo={profile.basicInfo}
        />
      );
    case 'other':
      return (
        <OtherDetailsTab
          prevStep={prevTab}
          nextStep={nextTab}
          initialValues={profile.otherInfo}
          confirmStep={setOtherDetails}
        />
      );
    case 'preferences':
      return (
        <PreferencesDetailsTab
          prevStep={prevTab}
          initialInfo={profile.preferences}
          completeProfile={setPreferences}
        />
      );
    default:
      return (
        <PersonalDetailsTab
          nextStep={nextTab}
          setPersonalDetails={setPersonalDetails}
        />
      );
  }
}

interface EditProfileProps {
  initialDetails: UserProfile | null;
  user: LoggedInUser;
}

function EditProfile({ initialDetails, user }: EditProfileProps): JSX.Element {
  const { currentInfoTab, nextTab, prevTab } = useDetailsPagination();
  const {
    profileDetails,
    setPersonalDetails,
    setBasicDetails,
    setOtherDetails,
    setPreferences,
    setAllDetails
  } = useProfileDetails();

  useEffect(() => {
    if (initialDetails) {
      setAllDetails(initialDetails);
    }
  }, [initialDetails])

  console.log(profileDetails);

  const confirmProfileDetails = (preferences: Preferences) => {
    setPreferences(preferences);
    // Since react updates state asynchronously, we need to pass the preferences immediately
    if (!user.filledProfile) {
      createUserProfile(user.accessToken, user.id, { ...profileDetails, preferences: preferences })
        .then((updatedProfile) => {
          if (updatedProfile) {
            setAllDetails(updatedProfile);
          }
        })
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full h-full sm:w-[50%] sm:h-[95%] md:w-[30%] bg-slate-50 rounded shadow shadow-gray-300 overflow-y-scroll no-scrollbar">
      <ChooseTab
        currentTab={currentInfoTab}
        nextTab={nextTab}
        prevTab={prevTab}
        setPreferences={confirmProfileDetails}
        setBasicDetails={setBasicDetails}
        setOtherDetails={setOtherDetails}
        setPersonalDetails={setPersonalDetails}
        profile={profileDetails}
      />
    </div>
  );
}

export default function EditProfilePage(): JSX.Element {
  const { user, userProfile } = useUserProfile()

  return (
    <AuthWrapper>
      <EditProfile initialDetails={userProfile} user={user!} />
    </AuthWrapper>
  );
}
