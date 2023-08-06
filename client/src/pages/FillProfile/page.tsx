import { Navigate } from '@tanstack/router';
import { useAuth } from '@/context/AuthContext';
import { useDetailsPagination } from '@/hooks/useDetailsPagination';
import { useProfileDetails } from '@/hooks/useProfileDetails';
import PersonalDetailsTab from './tabs/PersonalDetails';
import BasicDetailsTab from './tabs/BasicDetails';
import OtherDetailsTab from './tabs/OtherDetails';
import PreferencesDetailsTab from './tabs/PreferencesDetails';

export default function FillProfilePage() {
  const { user } = useAuth();
  const { currentInfoTab, nextTab, prevTab } = useDetailsPagination();
  const {
    profileDetails,
    setPersonalDetails,
    setImages,
    setBasicDetails,
    setOtherDetails,
    setPreferences,
  } = useProfileDetails();

  if (!user) {
    return <Navigate to="/" from="/fill-profile" />;
  }

  console.log(profileDetails);

  const whichTab = () => {
    switch (currentInfoTab) {
      case 'personal':
        return (
          <PersonalDetailsTab
            nextStep={nextTab}
            initialInfo={profileDetails.personalInfo}
            setPersonalDetails={setPersonalDetails}
          />
        );
      case 'basic':
        return (
          <BasicDetailsTab
            prevStep={prevTab}
            nextStep={nextTab}
            confirmStep={setBasicDetails}
            initialInfo={profileDetails.basicInfo}
          />
        );
      case 'other':
        return (
          <OtherDetailsTab
            prevStep={prevTab}
            nextStep={nextTab}
            initialValues={profileDetails.otherInfo}
            confirmStep={setOtherDetails}
          />
        );
      case 'preferences':
        return (
          <PreferencesDetailsTab
            prevStep={prevTab}
            initialInfo={profileDetails.preferences}
            completeProfile={setPreferences}
          />
        );
      default:
        return (
          <PersonalDetailsTab
            nextStep={nextTab}
            setImages={setImages}
            setPersonalDetails={setPersonalDetails}
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full h-full sm:w-[50%] sm:h-[95%] md:w-[30%] bg-slate-50 rounded shadow shadow-gray-300 overflow-y-scroll no-scrollbar">
      {whichTab()}
    </div>
  );
}
