export const SET_STATUS = 'SET_STATUS';

export const toggleLoading = (status = false) => {
  return dispatch => {
    dispatch({
      type: SET_STATUS,
      payload: status
    })
  }
};
