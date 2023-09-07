import { api } from './base';
import { errorHandler } from './conversations';
import { z } from 'zod';

const tenorSchema = z.object({
  next: z.string(),
  results: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      media_formats: z.object({
        gif: z.object({
          url: z.string(),
        }),
        tinygif: z.object({
          url: z.string(),
        }),
      }),
    })
  ),
});

export type Tenor = z.infer<typeof tenorSchema>;
type GetTrendingGifsResult =
  | { status: 'success'; data: Tenor }
  | { status: 'error'; error: string };
export const getTrendingGifs = async (): Promise<GetTrendingGifsResult> => {
  try {
    const response = await api.get('/tenor');
    const data = tenorSchema.parse(response.data);
    return { status: 'success', data };
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};

export type QueryGifsResult =
  | { status: 'success'; data: Tenor }
  | { status: 'error'; error: string };
export const queryGifs = async (query: string): Promise<QueryGifsResult> => {
  try {
    const response = await api.get(`/tenor/search?q=${query}`);
    const data = tenorSchema.parse(response.data);
    return { status: 'success', data };
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};
