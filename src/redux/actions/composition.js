export const SET_COMPOSITION_DATA = 'SET_COMPOSITION_DATA';

export const set_composition_data = (obj) => {
  return dispatch => {
    dispatch({
      type: SET_COMPOSITION_DATA,
      isLoading: obj.isLoading || false,
      data_form: obj.data_form || {},
      data_comp: obj.data_comp || {},
    })
  };
};
