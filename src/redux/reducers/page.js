import {
  SET_GETONE
} from '../actions/page';

export const initStore = {
  getone: {}
};

const handlers = (state = initStore, action) => {
  switch (action.type) {
    case SET_GETONE: {
      return { ...state, getone: action.getone }
    }
    default:
      return state;
  }
};

export default handlers;