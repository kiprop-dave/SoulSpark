import { Navigate, } from "@tanstack/router";
import { useAuth } from "@/context/AuthContext";
import { useDetailsPagination } from "@/hooks/useDetailsPagination";
import PersonalDetailsTab from "./components/PersonalDetails";
import BasicDetailsTab from "./components/BasicDetails";
import OtherDetailsTab from "./components/OtherDetails";
import PreferencesDetailsTab from "./components/PreferencesDetails";

export default function FillProfilePage() {
  const { user } = useAuth();
  const { currentInfoTab, nextTab, prevTab } = useDetailsPagination();

  if (!user) {
    return <Navigate to='/' from="/fill-profile" />
  };

  const whichTab = () => {
    switch (currentInfoTab) {
      case "personal":
        return <PersonalDetailsTab nextStep={nextTab} />;
      case "basic":
        return <BasicDetailsTab prevStep={prevTab} nextStep={nextTab} />;
      case "other":
        return <OtherDetailsTab prevStep={prevTab} nextStep={nextTab} />;
      case "preferences":
        return <PreferencesDetailsTab prevStep={prevTab} />;
      default:
        return <PersonalDetailsTab nextStep={nextTab} />;
    }
  }

  return (
    <div className="flex flex-col items-center w-full h-full sm:w-[30%] sm:h-[95%] bg-slate-50 rounded shadow shadow-gray-300">
      {whichTab()}
    </div>
  )
};
