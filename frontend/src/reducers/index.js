import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import group from './group';

export default combineReducers({
  alert,
  auth,
  profile,
  group,
});
