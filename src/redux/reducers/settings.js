import {
  SET_SETTINGS
} from '../actions/settings';

export const initStore = {
  viewtypes: []
};

const handlers = (state = initStore, action) => {
  switch (action.type) {
    case SET_SETTINGS: {
      return { ...state, ...action.data }
    }
    default:
      return state;
  }
};

export default handlers;
