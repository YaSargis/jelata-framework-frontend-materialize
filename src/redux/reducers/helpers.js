import {
  SET_STATUS
} from '../actions/helpers';

export const initStore = {
  loading: false
};

const handlers = (state = initStore, action) => {
  switch (action.type) {
    case SET_STATUS: {
      return { ...state, loading: action.payload }
    }
    default:
      return state;
  }
};

export default handlers;