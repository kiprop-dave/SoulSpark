import { useEffect } from 'react';
import clsx from 'clsx';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useImagesCarousel } from '@/hooks/useImagesCarousel';
import { Profile } from '@/api/profile';
import { ImagesCarousel } from './ImagesCarousel';
import { UserInfo } from './UserInfo';

type ProfileCardProps =
  | { profileStatus: 'filled'; profile: Profile }
  | { profileStatus: 'NotFilled'; id: string };

export default function ProfileCard(props: ProfileCardProps): JSX.Element {
  const { profile } = useUserProfile(props);
  const { currentIndex, atStart, atEnd, nextImage, previousImage, resetIndex } = useImagesCarousel(
    profile.profile?.personalInfo.images.length || 0
  );

  useEffect(() => {
    resetIndex();
  }, [props]);

  if (profile.status === 'ready') {
    return (
      <div className="w-full h-full overflow-y-scroll no-scrollbar">
        <div className="w-full h-2/3">
          <ImagesCarousel
            images={profile.profile?.personalInfo.images}
            index={currentIndex}
            atStart={atStart}
            atEnd={atEnd}
            next={nextImage}
            previous={previousImage}
          />
        </div>
        <div className="w-full flex items-center justify-center">
          <UserInfo
            personalInfo={profile.profile?.personalInfo}
            basicInfo={profile.profile?.basicInfo}
            otherInfo={profile.profile?.otherInfo}
          />
        </div>
      </div>
    );
  } else if (profile.status === 'NotReady') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-20 h-20 border-8 border-t-red-500 border-l-red-500 border-b-red-500 border-r-white rounded-full animate-spin" />
      </div>
    );
  } else {
    return (
      <div className="w-full h-full flex items-center justify-center">
        There was an error loading the profile
      </div>
    );
  }
}
