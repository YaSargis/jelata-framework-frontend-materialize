import React from 'react';
import { connect } from 'react-redux';
import { api } from 'src/defaults'; 
import { compose, withStateHandlers, withHandlers, lifecycle } from 'recompose';

import CommentList from './comment-list';
import Editor from 'src/pages/chat/components/editor';
import { Configer } from 'src/libs/methods';

import { apishka } from 'src/libs/api';
import { set_chat_id } from 'src/redux/actions/user';
import { actions } from '../reducer'
import Emoji from './emoji';

import { Comment, Modal, Input} from 'antd';
const { TextArea } = Input;

let EdiT = (((LaNg || {}).EdiT ||{})[LnG || 'EN'] || 'Edit')
let Message = (((LaNg || {}).Message ||{})[LnG || 'EN'] || 'Message')
let writeMessage = (((LaNg || {}).writeMessage ||{})[LnG || 'EN'] || 'writeMessage')

let socket;

const MainFrame = ({ 
	comments, submitting, value, set_state, handleSubmit, handleEdit, addEmoji, answerComment,visiblePicker, chatId, isSubmit,
	valueSign, refForm, refFormImg, isModalEditOpen, commentForEdit, isCommentDelete, globalSpin, lastComment, changedId
}) => {
  return (
    <div style={styles.comment__container}>
      <CommentList
        comments={comments}
        setStateUpComp={set_state}
        isCommentDelete={isCommentDelete}
        globalSpin={globalSpin}
        lastComment={lastComment}
        changedId={changedId}
        chatId={chatId}
        isSubmit={isSubmit}
      />
      <Comment
        style={{position: 'fixed', bottom: "0%", width: 'calc(100% - 500px)'}}
        content={
          <Editor
            onChange={event => set_state({ value: event.target.value })}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
            addEmoji={addEmoji}
            setStateUpComp={set_state}
            valueSign={valueSign}
            refForm={refForm}
            refFormImg={refFormImg}
            answerComment={answerComment}
            commentForEdit={commentForEdit}
          />
        }
      />
      <Modal
        title={EdiT}
        centered
        visible={isModalEditOpen}
        onCancel={() => set_state({ isModalEditOpen: false, commentForEdit: {} })}
        onOk={() => handleEdit()}
      >
        <div>{Message}</div>
        <div style={{display: 'flex'}}>
          <TextArea
            autoSize={{maxRows: 6}}
            value={commentForEdit.message_text}
            onChange={e=> set_state({
              commentForEdit: {
                ...commentForEdit,
                message_text: e.target.value
              }
            })}
            placeholder={writeMessage + '...'}
            onPressEnter={e => {
              if(e.keyCode == 13 && e.shiftKey == false) {
                e.preventDefault();
                handleEdit();
              }
            }}
          />
          <Emoji
            visiblePicker={visiblePicker}
            setStateUpComp={set_state}
            addEmoji={addEmoji}
          />
        </div>
      </Modal>
    </div>
  );
};

const enhance = compose(
  connect(
    state => ({
      chatId: state.user.chatId
    }),
    dispatch => ({
      set_chat_id: id => dispatch(set_chat_id(id)),
      requestListChats: () => dispatch(actions.requestListChats())
    })
  ),
  withStateHandlers(
    ({
      inState = {
        comments: [],
        submitting: false,
        value: '',
        valueSign: '',
        refForm: React.createRef(),
        refFormImg: React.createRef(),
        isModalEditOpen: false,
        commentForEdit: {},
        isCommentDelete: false,
        answerComment: null,
        globalSpin: true,
        visiblePickerEdit: false,
        lastComment: {},
        changedId: false,
        isSubmit: false
      }
    }) => ({
      comments: inState.comments,
      submitting: inState.submitting,
      value: inState.value,
      valueSign: inState.valueSign,
      refForm: inState.refForm,
      refFormImg: inState.refFormImg,
      isModalEditOpen: inState.isModalEditOpen,
      commentForEdit: inState.commentForEdit,
      isCommentDelete: inState.isCommentDelete,
      answerComment: inState.answerComment,
      globalSpin: inState.globalSpin,
      visiblePickerEdit: inState.visiblePickerEdit,
      lastComment: inState.lastComment,
      changedId: inState.changedId,
      isSubmit: inState.isSubmit
    }),
    {
      set_state: state => obj => {
        let _state = {...state},
            keys = Object.keys(obj);
        keys.map(key => _state[key ] = obj[key]);
        return _state;
      }
    }
  ),
  withHandlers({
    handleWS: ({ set_state, requestListChats }) => (chatId) => {
      let ws = document.location.href.split('//')[1]
      let ws_protocol = document.location.href.split('//')[0].indexOf('s') !== -1? 'wss' : 'ws'
      ws = ws.split('/')[0]
      ws = ws_protocol + '://' + ws + '/messages'
      socket = new WebSocket(ws)
      socket.onopen = () => {
        socket.send(JSON.stringify({dialogid: chatId}));
      };
      socket.onmessage = event => {

        const resWS = JSON.parse(event.data);
        resWS.forEach(item => item['key'] = item.id);
        if((resWS.length > 0)) {
          set_state({
            globalSpin: false,
            comments: [...resWS],
            isCommentDelete: false,
            submitting: false,
            lastComment: resWS[resWS.length - 1]
          });
          resWS.forEach((item, ind) => {
            if(resWS.length -1 === ind) {
              apishka('GET', {}, '/api/dialog_message_setreaded?id=' + item.id, () => requestListChats())
            } else {
              apishka('GET', {}, '/api/dialog_message_setreaded?id=' + item.id)
            }
          });
        } else {
          set_state({
            globalSpin: false
          })
        }
      }
      socket.onclose = (event) => {
        console.log("WebSocket is closed now.");
      };
    },
    handleSubmit: ({value, chatId, set_state, refForm, refFormImg, answerComment}) => (files, val, typeMessage) => {
      set_state({submitting: true, isSubmit: true})
      let resultTrimValue;
      if(typeMessage) {
        resultTrimValue = val.trimLeft();

        val !== '' ? apishka('POST', {
            dialogid: chatId,
            message_text: resultTrimValue
          }, '/api/dialog_message_send', () => {set_state({valueSign: ''});}
        )
        : null;

        for (let i in files) {
          if(i === 'length' || i === 'item') break;
          let _data = new FormData();
          _data.append('config', JSON.stringify({type: typeMessage}));
          _data.append('dialogid', chatId);

          if(i == (files.length - 1)) {
            _data.append('file_0', files[i]);
            apishka('POST', _data, '/api/dialog_message_send', () => {
                refForm.current.reset();
                refFormImg.current.reset();
              }, (err) => {
                set_state({submitting: false})
              }
            )
          } else {
            _data.append('file_0', files[i]);
            apishka('POST', _data, '/api/dialog_message_send')
          }
        }
      } else {
        resultTrimValue = value.trimLeft();
        let _data = {
          dialogid: chatId,
          message_text: resultTrimValue,
          reply_to: answerComment ? answerComment.id : null
        };
        apishka('POST', _data, '/api/dialog_message_send', () => {
            set_state({value: '', valueSign: '', answerComment: null});
            refForm.current.reset();
            refFormImg.current.reset();
          }, (err) => {
            set_state({submitting: false})
          }
        )
      }
    },
    handleEdit: ({commentForEdit, set_state}) => () => {
      set_state({submitting: true, isSubmit: true})
      apishka('POST', {
            id: commentForEdit.id,
            message_text: commentForEdit.message_text
          }, '/api/dialog_message_edit', () => {
            set_state({ commentForEdit: {}, isModalEditOpen: false})
          }
      )

    },
    addEmoji: ({set_state, value, commentForEdit}) => (e) => {
      let sym = e.unified.split('-')
      let codesArray = []
      sym.forEach(el => codesArray.push('0x' + el))
      let emoji = String.fromCodePoint(...codesArray)
      Object.keys(commentForEdit).length === 0 && commentForEdit.constructor === Object ? set_state({ value: value + emoji }) : set_state({commentForEdit: {...commentForEdit, message_text: commentForEdit.message_text + emoji }});
    }
  }),
  lifecycle({
    componentDidMount(){
      const { handleWS, chatId } = this.props;
      handleWS(chatId);
    },
    componentDidUpdate(prevProps){
      const { chatId, handleWS, set_state } = this.props;
      if(prevProps.chatId !== chatId) {
        set_state({answerComment: null, comments: [], globalSpin: true, changedId: true})
        socket.close();
        handleWS(chatId);
      }
    },
  })
);

const styles = {
  comment__container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  }
};

export default enhance(MainFrame);
