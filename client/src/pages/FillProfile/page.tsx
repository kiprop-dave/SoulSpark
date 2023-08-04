import { Navigate } from '@tanstack/router';
import { useAuth } from '@/context/AuthContext';
import { useDetailsPagination } from '@/hooks/useDetailsPagination';
import { useProfileDetails } from '@/hooks/useProfileDetails';
import PersonalDetailsTab from './components/PersonalDetails';
import BasicDetailsTab from './components/BasicDetails';
import OtherDetailsTab from './components/OtherDetails';
import PreferencesDetailsTab from './components/PreferencesDetails';

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
            setImages={setImages}
            setPersonalDetails={setPersonalDetails}
            profileDetails={profileDetails}
          />
        );
      case 'basic':
        return (
          <BasicDetailsTab prevStep={prevTab} nextStep={nextTab} confirmStep={setBasicDetails} />
        );
      case 'other':
        return <OtherDetailsTab prevStep={prevTab} nextStep={nextTab} />;
      case 'preferences':
        return <PreferencesDetailsTab prevStep={prevTab} />;
      default:
        return (
          <PersonalDetailsTab
            nextStep={nextTab}
            setImages={setImages}
            setPersonalDetails={setPersonalDetails}
            profileDetails={profileDetails}
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
