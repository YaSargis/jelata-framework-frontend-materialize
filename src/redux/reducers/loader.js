import {
  SET_LOADED
} from '../actions/loader';

export const initStore = {
  isLoading: false
};

const handlers = (state = initStore, action) => {
  switch (action.type) {
    case SET_LOADED: {
      return { ...state, isLoading: action.status }
    }
    default:
      return state;
  }
};

export default handlers;