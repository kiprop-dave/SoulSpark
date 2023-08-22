import { Link } from '@tanstack/router';
import { useUserProfile } from '@/context/UserProfileContext';
import { useImagesCarousel } from '@/hooks/useImagesCarousel';
import { Button } from '@/components/ui/button';
import { ImagesCarousel } from '../components/ImagesCarousel';
import { UserInfo } from '../components/UserInfo';

export default function ProfilePage(): JSX.Element {
  const { userProfile, loading } = useUserProfile();

  const {
    currentIndex,
    nextImage,
    previousImage,
    atStart,
    atEnd: end,
  } = useImagesCarousel(userProfile?.personalInfo.images?.length || 0);

  //TODO: Add skeleton loading
  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center w-full sm:w-[60%] md:w-[40%] h-full overflow-scroll no-scrollbar relative md:shadow-lg md:shadow-slate-300 dark:shadow-black">
      <div className="w-full h-[90%] overflow-scroll no-scrollbar bg-white dark:bg-neutral-800">
        <div className="h-[76%] w-full rounded-lg bg-slate-100 dark:bg-neutral-950">
          <ImagesCarousel
            images={userProfile?.personalInfo.images!}
            index={currentIndex}
            next={nextImage}
            previous={previousImage}
            atStart={atStart}
            atEnd={end}
          />
        </div>
        <div className="h-[20%] w-full flex items-center justify-center">
          <UserInfo
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
