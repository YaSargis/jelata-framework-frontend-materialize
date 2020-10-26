export const SET_LOADED = 'SET_LOADED';

// state loading (true/false)
export const set_loading = (status) => {
  return dispatch => {
    dispatch({
      type: SET_LOADED,
      status: status || false
    })
  };
};
