import axios from 'axios';
import { api } from './base';
import {
  possibleMatchSchema,
  PossibleMatch,
  likeResponseSchema,
  LikeResponse,
  Match,
  matchSchema,
} from '@/types';

export type PossibleError = 'unauthorized' | 'serverError' | 'unknownError' | 'validationError';
type getPossibleMatchesResult =
  | { status: 'success'; data: PossibleMatch[] }
  | { status: 'error'; error: PossibleError };

export const getPossibleMatches = async (token: string): Promise<getPossibleMatchesResult> => {
  try {
    const response = await api.get('/matches/possible', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Array.isArray(response.data) ? response.data : [];

    const matches = data
      .map((match) => {
        const result = possibleMatchSchema.safeParse(match);
        if (result.success) {
          return result.data;
        } else {
          return null;
        }
      })
      .filter((match) => match !== null) as PossibleMatch[];

    return { status: 'success', data: matches };
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      if (err.response?.status === 401) {
        return { status: 'error', error: 'unauthorized' };
      }
      return { status: 'error', error: 'serverError' };
    } else {
      return { status: 'error', error: 'unknownError' };
    }
  }
};

type LikeMatchResult =
  | { status: 'success'; data: LikeResponse }
  | { status: 'error'; error: PossibleError };

export const likeMatch = async (token: string, matchId: string): Promise<LikeMatchResult> => {
  try {
    const res = await api.get(`/matches/like/${matchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = likeResponseSchema.safeParse(res.data);
    if (result.success) {
      return { status: 'success', data: result.data };
    } else {
      return { status: 'error', error: 'serverError' };
    }
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      if (err.response?.status === 401) {
        return { status: 'error', error: 'unauthorized' };
      }
      return { status: 'error', error: 'serverError' };
    } else {
      return { status: 'error', error: 'unknownError' };
    }
  }
};

type DislikeMatchResult = { status: 'success' } | { status: 'error'; error: PossibleError };
export const dislikeMatch = async (token: string, matchId: string): Promise<DislikeMatchResult> => {
  try {
    await api.get(`/matches/dislike/${matchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { status: 'success' };
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      if (err.response?.status === 401) {
        return { status: 'error', error: 'unauthorized' };
      }
      return { status: 'error', error: 'serverError' };
    } else {
      return { status: 'error', error: 'unknownError' };
    }
  }
};

type getMatchesResult =
  | { status: 'success'; data: Match[] }
  | { status: 'error'; error: PossibleError };
export const getMatches = async (token: string): Promise<getMatchesResult> => {
  try {
    const response = await api.get('/matches', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = Array.isArray(response.data) ? response.data : [];
    const validatedResponse = data.reduce((acc: Match[], match) => {
      const result = matchSchema.safeParse(match);
      if (result.success) {
        acc.push(result.data);
      }
      return acc;
    }, []);

    return { status: 'success', data: validatedResponse };
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      if (err.response?.status === 401) {
        return { status: 'error', error: 'unauthorized' };
      }
      return { status: 'error', error: 'serverError' };
    } else {
      return { status: 'error', error: 'unknownError' };
    }
  }
};
