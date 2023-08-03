import axios from 'axios';

import { apiBaseUrl } from '@/lib/constants';

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});
