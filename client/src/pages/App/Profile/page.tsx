import { Link } from '@tanstack/router';
import { PersonalInfo, BasicInfo, OtherInfo, Preferences } from '@/types';
import { useUserProfile } from '@/context/UserProfileContext';
import { Button } from '@/components/ui/button';
import { ImagesCarousel } from '../components/ImagesCarousel';

export default function ProfilePage(): JSX.Element {
  const { userProfile } = useUserProfile();

  return (
    <div className="flex flex-col items-center w-full sm:w-[60%] md:w-[40%] h-full overflow-scroll no-scrollbar relative">
      <div className="w-full h-[90%] overflow-scroll no-scrollbar bg-white dark:bg-neutral-800">
        <div className="h-[76%] w-full rounded-lg bg-slate-100 dark:bg-neutral-950">
          <ImagesCarousel images={userProfile?.personalInfo.images!} />
        </div>
        <div className="h-[20%] w-full flex items-center justify-center">
          <ProfileDetails
            personalInfo={userProfile?.personalInfo!}
            preferences={userProfile?.preferences!}
            basicInfo={userProfile?.basicInfo}
            otherInfo={userProfile?.otherInfo}
          />
        </div>
      </div>
      <div className="absolute bottom-0 h-12 sm:h-16 w-full flex items-start justify-center bg-white dark:bg-neutral-800">
        <Button className="w-2/3 h-12 rounded-3xl bg-gradient-to-tr from-red-500 to-orange-300 text-white">
          <Link
            to="/edit-profile"
            from="/app/profile"
            className="text-xl font-semibold w-full h-full"
          >
            Edit Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}

interface ProfileDetailsProps {
  personalInfo: PersonalInfo;
  basicInfo?: BasicInfo;
  otherInfo?: OtherInfo;
  preferences: Preferences;
}

function ProfileDetails({
  personalInfo,
  basicInfo,
  otherInfo,
  preferences,
}: ProfileDetailsProps): JSX.Element {
  const age = new Date().getFullYear() - new Date(personalInfo.dateOfBirth).getFullYear();

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="py-2 px-2 w-full border-b border-b-slate-300 dark:border-b-gray-700">
        <h1 className="text-3xl font-semibold dark:text-white">
          {personalInfo.first_name}
          <span className="text-2xl font-semibold ml-2">{age}</span>
        </h1>
        <p className="text-slate-600 tracking-wider dark:text-gray-300">{personalInfo.gender}</p>
      </div>
      <div className="py-2 px-2 w-full border-b border-b-slate-300 dark:border-b-gray-700">
        <h1 className="font-semibold dark:text-white">Looking for</h1>
        <p className="text-slate-600 tracking-wider dark:text-gray-300">{preferences.lookingFor}</p>
      </div>
      <div className="py-2 px-2 w-full border-b border-b-slate-300 dark:border-b-gray-700">
        <h1 className="font-semibold dark:text-white">Languages I know</h1>
        <p className="text-slate-600 tracking-wider dark:text-gray-300">{basicInfo?.languages?.join(', ')}</p>
      </div>
      <div className="py-2 px-2 w-full border-b border-b-slate-300 dark:border-b-gray-700">
        <h1 className="font-semibold dark:text-white">Interests</h1>
        <p className="text-slate-600 tracking-wider dark:text-gray-300">{otherInfo?.interests?.join(', ')}</p>
      </div>
    </div>
  );
}
