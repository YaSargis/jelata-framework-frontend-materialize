import React from 'react';
import { useSelector, useDispatch, connect } from "react-redux";
import { actions } from '../reducer'
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { Modal, Button, notification, Select,
        Spin, Avatar } from 'antd';
import { api } from 'src/defaults';
import { apishka } from 'src/libs/api';

let timer = {};

let chatNotCh = (((LaNg || {}).chatNotCh ||{})[LnG || 'EN'] || 'You have not selected chat participants')
let chatCreated = (((LaNg || {}).chatCreated ||{})[LnG || 'EN'] || 'Created')
let chatInit = (((LaNg || {}).chatInit ||{})[LnG || 'EN'] || 'Initializing chat')
let chatMembers = (((LaNg || {}).chatInit ||{})[LnG || 'EN'] || 'Chat members')
let userNotFound = (((LaNg || {}).userNotFound ||{})[LnG || 'EN'] || 'user not found')
let Search = (((LaNg || {}).Search ||{})[LnG || 'EN'] || 'Search...')
let Create = (((LaNg || {}).Create ||{})[LnG || 'EN'] || 'Create')

const enhance = compose(
  connect(
    () => ({}),
    dispatch => ({
      requestListChats: () => dispatch(actions.requestListChats()),
      actWithModal: flag => dispatch(actions.modalInitPerson(flag))
    })
  ),
  withStateHandlers(
    ({
      inState = {
        userData: [],
        valueSelect: [],
        arrUserForSubmit: [],
        fetching: false,
        listEmpty: false
      }
    }) => ({
      userData: inState.userData,
      valueSelect: inState.valueSelect,
      arrUserForSubmit: inState.arrUserForSubmit,
      fetching: inState.fetching,
      listEmpty: false
    }),
    {
      set_state: state => obj => {
        let _state = {...state},
            keys = Object.keys(obj);
        keys.map(key => _state[key] = obj[key]);
        return _state;
      }
    }
  ),
  withHandlers({
    getListData: ({ set_state }) => (_substr) => {
      if(_substr === '') {
        return;
      }
      set_state({fetching: true})
      timer['listUserSelect'] ? clearTimeout(timer['listUserSelect']) : null;
      const getDataSelect = new Promise(resolve => {
        timer['listUserSelect'] = setTimeout(() => {
          apishka('GET', {}, '/api/dialogs_usersearch?substr=' + _substr, (res) => {
            let dat = _.sortBy(res.outjson, ['login']);
            resolve(dat);
          })
        }, 100)
      });

      return getDataSelect.then(res => {
        set_state({fetching: false});
        if(res.length === 0) set_state({listEmpty: true});
        const preparedOptions = res.map(item => {
          return {
            login: item.login,
            avatar: item.photo === null ? null : api._url + item.photo[0]?.uri,
            id: item.id
          }
        });

        set_state({userData: preparedOptions})
      })
    },
    onChangeSelect: ({ userData, set_state }) => value => {
      let arr = [];
      userData.forEach(it => {
        if(it.login === value){
          arr.push(it.id);
        }
      });
      set_state({
        valueSelect: value,
        arrUserForSubmit: arr
      });
    }
  }),
  withHandlers({
    createChatRoom: ({ arrUserForSubmit, userData, set_stateUpComponent, set_state, requestListChats, actWithModal }) => () => {
      if(userData.length === 0) {
        notification['error']({
          message: chatNotCh
        });
        return;
      }

      let  _data = {
          config: {type: 'image'},
          reciver_user_id: arrUserForSubmit[0],
        };


      apishka('POST', _data, '/api/dialog_personal_create', (res) => {
        actWithModal(false)
        requestListChats()
        set_stateUpComponent({ statusCreateChat: true });
        notification['success']({
          message:chatCreated
        });
        set_state({
          arrUserForSubmit: [],
          userData: [],
          valueSelect: []
        });
      } )
    },
  })
);

const ModalInitPersonChat = ({ userData, valueSelect, fetching, getListData, onChangeSelect, createChatRoom, listEmpty }) => {
  const visibleStatus = useSelector(state => state.chat.statusModalInitPerson)
  const dispatch = useDispatch()

  return <Modal
    centered
    visible={visibleStatus}
    title={chatInit}
    onCancel={() => dispatch(actions.modalInitPerson(false))}
    footer={null}
  >
    <div>
      <div>{chatMembers}</div>
      <Select
        notFoundContent={fetching ? <Spin size="small" /> : listEmpty && <div style={styles.listEmpty}>{userNotFound}</div>}
        placeholder={Search}
        value={valueSelect}
        onChange={value => onChangeSelect(value)}
        onSearch={getListData}
        style={styles.select}
        size='large'
        showSearch
        autoFocus
      >
        {userData.map(userObj => (
          <Select.Option key={userObj.login}>
            {userObj.avatar === null ? <Avatar icon='user' /> : <Avatar src={userObj.avatar}/> }
            <span style={styles.option__name}>{userObj.login}</span>
          </Select.Option>
        ))}
      </Select>
    </div>
    <div style={styles.btn__secondContainer}>
      <Button
        type='primary'
        onClick={() => createChatRoom()}
      >
		{Create}
      </Button>
    </div>
  </Modal>
};

const styles = {
  btn__firstContainer: {
    textAlign: 'center'
  },
  btn__secondContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100
  },
  btn: {
    marginTop: 50
  },
  option__name: {
    marginLeft: 10
  },
  select: {
    width: '100%'
  },
  listEmpty: {
    textAlign: 'center'
  }
};

export default enhance(ModalInitPersonChat);
