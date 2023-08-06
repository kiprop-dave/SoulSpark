import { useReducer } from 'react';
import {
  UserProfile,
  PersonalInfo,
  BasicInfo,
  OtherInfo,
  Preferences,
  PersonalInfoNoImages,
} from '@/types';

enum ActionType {
  SET_PERSONAL_DETAILS = 'SET_PERSONAL_DETAILS',
  SET_IMAGES = 'SET_IMAGES',
  SET_BASIC_DETAILS = 'SET_BASIC_DETAILS',
  SET_OTHER_DETAILS = 'SET_OTHER_DETAILS',
  SET_PREFERENCES = 'SET_PREFERENCES',
}

type SetPersonalDetailsAction =
  | {
      type: ActionType.SET_PERSONAL_DETAILS;
      payload: PersonalInfoNoImages;
    }
  | {
      type: ActionType.SET_IMAGES;
      payload: string[];
    }
  | {
      type: ActionType.SET_BASIC_DETAILS;
      payload: BasicInfo;
    }
  | {
      type: ActionType.SET_OTHER_DETAILS;
      payload: OtherInfo;
    }
  | {
      type: ActionType.SET_PREFERENCES;
      payload: Preferences;
    };

function profileReducer(state: UserProfile, action: SetPersonalDetailsAction): UserProfile {
  const { type, payload } = action;
  switch (type) {
    case ActionType.SET_PERSONAL_DETAILS:
      return {
        ...state,
        personalInfo: {
          ...state.personalInfo,
          ...payload,
        },
      };
    case ActionType.SET_IMAGES:
      return {
        ...state,
        personalInfo: {
          ...state.personalInfo,
          images: payload,
        },
      };
    case ActionType.SET_BASIC_DETAILS:
      return {
        ...state,
        basicInfo: payload,
      };
    case ActionType.SET_OTHER_DETAILS:
      return {
        ...state,
        otherInfo: payload,
      };
    case ActionType.SET_PREFERENCES:
      return {
        ...state,
        preferences: payload,
      };
    default:
      return state;
  }
}

export function useProfileDetails() {
  const [profileDetails, dispatch] = useReducer(profileReducer, {
    personalInfo: {
      first_name: '',
      last_name: '',
      dateOfBirth: new Date(),
      gender: 'Prefer not to say',
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

  const setPersonalDetails = (payload: PersonalInfoNoImages) =>
    dispatch({ type: ActionType.SET_PERSONAL_DETAILS, payload });
  const setImages = (payload: string[]) => dispatch({ type: ActionType.SET_IMAGES, payload });
  const setBasicDetails = (payload: BasicInfo) =>
    dispatch({ type: ActionType.SET_BASIC_DETAILS, payload });
  const setOtherDetails = (payload: OtherInfo) =>
    dispatch({ type: ActionType.SET_OTHER_DETAILS, payload });
  const setPreferences = (payload: Preferences) =>
    dispatch({ type: ActionType.SET_PREFERENCES, payload });

  return {
    profileDetails,
    setPersonalDetails,
    setImages,
    setBasicDetails,
    setOtherDetails,
    setPreferences,
  };
}
