import PusherClient from 'pusher-js';
import { apiBaseUrl } from './constants';

// This allows the request to be sent with the cookies
//@ts-ignore
PusherClient.Runtime.createXHR = function () {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  return xhr;
};

export const pusherClient = new PusherClient('7f1b167426e1280ce833', {
  cluster: 'ap2',
  channelAuthorization: {
    endpoint: `${apiBaseUrl}/auth/pusher`,
    transport: 'ajax',
  },
});
