import PusherClient from 'pusher-js';
import { apiBaseUrl } from './constants';

export const pusherClient = new PusherClient('7f1b167426e1280ce833', {
  cluster: 'ap2',
  channelAuthorization: {
    endpoint: `${apiBaseUrl}/auth/pusher`,
    transport: 'ajax',
  },
});
