export const GET_MENUAPP = 'GET_MENUAPP';
export const SET_OPEN_KEYS = 'SET_OPEN_KEYS';
export const SET_LOGIN_STATUS = 'SET_LOGIN_STATUS';
export const GET_FAVORITS_MENU = 'GET_FAVORITS_MENU';
export const SET_COLLAPSE_STATUS = 'SET_COLLAPSE_STATUS';
export const GET_CHAT_ID = 'GET_CHAT_ID';
export const IS_FIRST_ID = 'IS_FIRST_ID';
export const IS_UNREADED_EXIST = 'IS_UNREADED_EXIST';
// get user menu
export const get_menu = data => {
  return dispatch => {
    dispatch({
      type: GET_MENUAPP,
      user_detail: data.data.outjson.userdetail,
      usermenu: data.data.outjson.usermenu,
      custom_menu: data.data.outjson.menus,
      status: true
    });
  };
};

export const reset_app = () => {
  return dispatch => {
    dispatch({
      type: GET_MENUAPP,
      user_detail: {},
      usermenu: [],
      custom_menu: [],
      status: false,
      favorits_menu: []
    });
  };
};

// auth state (true/false)
export const set_login_status = status => {
  return dispatch => {
    dispatch({
      type: SET_LOGIN_STATUS,
      status: status || false
    });
  };
};

export const set_open_keys = keys => {
  return dispatch => {
    dispatch({
      type: SET_OPEN_KEYS,
      keys: keys || []
    });
  };
};

// ------------------------------------------------------------ favorits menu start

export const get_favorits_menu = () => {
  let fav_menu = JSON.parse(localStorage.getItem('allPages')); // LS get
  return dispatch => {
    dispatch({
      type: GET_FAVORITS_MENU,
      payload: fav_menu || []
    });
  };
};

export const set_favorits_menu = menu => {
  localStorage.setItem('allPages', JSON.stringify(menu)); // LS upd
  return dispatch => {
    dispatch({
      type: GET_FAVORITS_MENU,
      payload: menu || []
    });
  };
};

// ------------------------------------------------------------ favorits menu end
// ........... chat
export const get_chat_id = () => {
  const chat_id = JSON.parse(sessionStorage.getItem('chat_id'));
  return dispatch => {
    dispatch({
      type: GET_CHAT_ID,
      payload: chat_id || null
    });
  };
};

export const set_chat_id = id => {
  sessionStorage.setItem('chat_id', JSON.stringify(id));
  return dispatch => {
    dispatch({
      type: GET_CHAT_ID,
      payload: id
    });
  };
};

export const set_first_id = status => {
  return dispatch => {
    dispatch({
      type: IS_FIRST_ID,
      status: status || false
    });
  };
};

export const set_unreaded_status = status => {
  return dispatch => {
    dispatch({
      type: IS_UNREADED_EXIST,
      status: status || false
    });
  };
};

// ........ end chat
