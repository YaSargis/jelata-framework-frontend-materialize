import {
  GET_CHAT_ID,
  GET_MENUAPP,
  SET_OPEN_KEYS,
  SET_LOGIN_STATUS,
  GET_FAVORITS_MENU,
  SET_COLLAPSE_STATUS,
  IS_FIRST_ID,
  IS_UNREADED_EXIST
} from '../actions/user';

export const initStore = {
  custom_menu: [],
  usermenu: [],
  user_detail: {},
  isLogin: true,
  collapsed: false,
  open_keys: [],
  favorits_menu: []
};

const handlers = (state = initStore, action) => {
  switch (action.type) {
    case GET_MENUAPP: {
      return {
        ...state,
        user_detail: action.user_detail,
        custom_menu: action.custom_menu,
        usermenu: action.usermenu,
        isLogin: action.status
      }
    }
    case GET_FAVORITS_MENU: {
      return { ...state, favorits_menu: action.payload }
    }
    case SET_LOGIN_STATUS: {
      return { ...state, isLogin: action.status }
    }
    case SET_OPEN_KEYS: {
      return { ...state, open_keys: action.keys }
    }
    case SET_COLLAPSE_STATUS: {
      return { ...state, collapsed: action.status }
    }
    case GET_CHAT_ID: {
      return {...state, chatId: action.payload}
    }
    case IS_FIRST_ID: {
      return {...state, is_first_id: action.status}
    }
    case IS_UNREADED_EXIST: {
      return {...state, is_unreaded_exist: action.status}
    }
    default:
      return state;
  }
};

export default handlers;