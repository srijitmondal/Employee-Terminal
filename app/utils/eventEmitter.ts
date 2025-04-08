import EventEmitter from 'eventemitter3';

export const eventEmitter = new EventEmitter();
export const EVENTS = {
  USER_LOGOUT: 'USER_LOGOUT',
  USER_LOGIN: 'USER_LOGIN'
};

