import { useUserProfile } from '@/context/UserProfileContext';

export function Waiting(): JSX.Element {
  const { userProfile } = useUserProfile();
  const userAvatar = userProfile?.personalInfo?.images[0]?.secure_url;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="w-36 h-36 relative">
        <div className="w-full h-full absolute top-0 rounded-full border-2 border-black dark:border-white animate-ping" />
        <img
          src={userAvatar}
          alt="user avatar"
          className="w-full h-full rounded-full object-cover absolute top-0"
        />
      </div>
    </div>
  );
}
