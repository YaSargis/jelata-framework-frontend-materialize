import {
  SET_COMPOSITION_DATA
} from '../actions/composition';

export const initStore = {
  isLoading: false,
  data_form: {},
  data_comp: {},
};

const handlers = (state = initStore, action) => {
  switch (action.type) {
    case SET_COMPOSITION_DATA: {
      return {
        ...state,
        isLoading: action.isLoading,
        data_form: action.data_form,
        data_comp: action.data_comp
      }
    }
    default:
      return state;
  }
};

export default handlers;