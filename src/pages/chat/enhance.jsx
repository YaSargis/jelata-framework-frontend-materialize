import { compose, withStateHandlers, lifecycle } from "recompose";
import { connect } from "react-redux";
import React from "react";

import {
  get_chat_id,
  set_chat_id
} from "src/redux/actions/user";

const enhance = compose(
  connect(
    (state) => ({
      chatId: state.user.chatId,
      listChats: state.chat.listChats
    }),
    (dispatch) => ({
      get_chat_id: () => dispatch(get_chat_id()),
      set_chat_id: (id) => dispatch(set_chat_id(id)),
    })
  ),
  withStateHandlers(
    ({
      inState = {
        openDrawerPanel: false,
        carouselRef: React.createRef(),
        statusCreateChat: false,
        chatPhotoUri: "",
        chatName: ""
      },
    }) => ({
      openDrawerPanel: inState.openDrawerPanel,
      carouselRef: inState.carouselRef,
      statusCreateChat: inState.statusCreateChat,
      chatPhotoUri: inState.chatPhotoUri,
      chatName: inState.chatName
    }),
    {
      set_state: (state) => (obj) => {
        let _state = { ...state },
          keys = _.keys(obj);
        keys.map((key) => (_state[key] = obj[key]));
        return _state;
      },
    }
  ),
  lifecycle({
    componentDidUpdate(prevProps) {
      const {
        chatId,
        listChats,
        set_state,
        statusCreateChat,
        set_chat_id,
      } = this.props;
      if (prevProps.chatId !== chatId) {
        if (chatId) { 
          if (listChats.length > 0) {
            const findedObj = listChats.find((item) => item.id === chatId);
            set_state({
              chatPhotoUri: (findedObj.photo || [])[0]
                ? findedObj.photo[0].uri
                : "",
              chatName: findedObj.title,
            });
          }
        }
      }

      if (
        statusCreateChat === true &&
        prevProps.listChats !== listChats
      ) {
        const lastItem = listChats[0];
        set_chat_id(lastItem.id);
        set_state({ statusCreateChat: false });
      }

      if (prevProps.listChats !== listChats && chatId) {
        if (listChats.length > 0) {
          const findedObj = listChats.find((item) => item.id === chatId);
          try {
            set_state({
              chatPhotoUri:
                findedObj.photo && findedObj.photo[0]
                  ? findedObj.photo[0].uri
                  : "",
              chatName: findedObj.title,
            });
          } catch (e) {
            console.error("inner", e.message);
            throw e;
          }
        }
      }
    },
  })
);

export default enhance;
