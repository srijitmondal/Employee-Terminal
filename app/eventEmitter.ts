import EventEmitter from 'eventemitter3';

export const eventEmitter = new EventEmitter();

export const EVENTS = {
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN',
  FETCH_DATA: 'FETCH_DATA'
};