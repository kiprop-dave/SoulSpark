import { PersonalInfo, BasicInfo, OtherInfo, Preferences } from '@/types';

type UserInfoProps = {
  personalInfo: PersonalInfo;
  basicInfo?: BasicInfo;
  otherInfo?: OtherInfo;
  preferences: Preferences;
};

export function UserInfo(props: UserInfoProps): JSX.Element {
  const { personalInfo, basicInfo, otherInfo, preferences } = props;

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="py-2 px-2 w-full border-b border-b-slate-300 dark:border-b-gray-700">
        <NameAge first_name={personalInfo.first_name} dateOfBirth={personalInfo.dateOfBirth} />
        <p className="text-slate-600 tracking-wider dark:text-gray-300">{personalInfo.gender}</p>
      </div>
      <div className="py-2 px-2 w-full border-b border-b-slate-300 dark:border-b-gray-700">
        <h1 className="font-semibold dark:text-white">Looking for</h1>
        <p className="text-slate-600 tracking-wider dark:text-gray-300">{preferences.lookingFor}</p>
      </div>
      {basicInfo?.languages?.length !== undefined && basicInfo?.languages?.length > 0 && (
        <div className="py-2 px-2 w-full border-b border-b-slate-300 dark:border-b-gray-700">
          <h1 className="font-semibold dark:text-white">Languages I know</h1>
          <p className="text-slate-600 tracking-wider dark:text-gray-300">
            {basicInfo?.languages?.join(', ')}
          </p>
        </div>
      )}
      {otherInfo?.interests?.length !== undefined && otherInfo?.interests?.length > 0 && (
        <div className="py-2 px-2 w-full border-b border-b-slate-300 dark:border-b-gray-700">
          <h1 className="font-semibold dark:text-white">Interests</h1>
          <p className="text-slate-600 tracking-wider dark:text-gray-300">
            {otherInfo?.interests?.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

type NameAgeProps = Pick<PersonalInfo, 'first_name' | 'dateOfBirth'>;

export function NameAge({ first_name, dateOfBirth }: NameAgeProps): JSX.Element {
  const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();

  return (
    <h1 className="text-3xl font-semibold dark:text-white">
      {first_name}
      <span className="text-2xl font-semibold ml-2">{age}</span>
    </h1>
  );
}
