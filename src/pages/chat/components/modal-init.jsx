import React from 'react';
import { useSelector, useDispatch, connect } from "react-redux";
import { actions } from '../reducer'
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { Modal, Button, Carousel, Input, notification, Select,
        Spin, Avatar } from 'antd';
import { api } from 'src/defaults';
import { apishka } from 'src/libs/api';

let timer = {};


let chatNotCh = (((LaNg || {}).chatNotCh ||{})[LnG || 'EN'] || 'You have not selected chat participants')
let chatCreatedGroup = (((LaNg || {}).chatCreatedGroup ||{})[LnG || 'EN'] || 'Created')
let chatInitGroup = (((LaNg || {}).chatInitGroup ||{})[LnG || 'EN'] || 'Initializing a group chat')
let chatMembers = (((LaNg || {}).chatInit ||{})[LnG || 'EN'] || 'Chat members')
let userNotFound = (((LaNg || {}).userNotFound ||{})[LnG || 'EN'] || 'user not found')
let Search = (((LaNg || {}).Search ||{})[LnG || 'EN'] || 'Search...')
let Create = (((LaNg || {}).Create ||{})[LnG || 'EN'] || 'Create')
let uncorrectData = (((LaNg || {}).uncorrectData ||{})[LnG || 'EN'] || 'uncorrect data')
let uploadImage = (((LaNg || {}).uploadImage ||{})[LnG || 'EN'] || 'upload image')
let chatGroupTitle = (((LaNg || {}).chatGroupTitle ||{})[LnG || 'EN'] || 'group title')
let chatGroupTitleEnter = (((LaNg || {}).chatGroupTitleEnter ||{})[LnG || 'EN'] || 'Enter the group title')
let Next = (((LaNg || {}).Next ||{})[LnG || 'EN'] || 'Next')
let chatGoBack = (((LaNg || {}).chatGoBack ||{})[LnG || 'EN'] || 'Go back')

const ModalInit = ({ 
	carouselRef, fetching, createChatRoom, setStateFile,
	inputGroupName, set_state, usersData, valueSelect, getListData, onChangeSelect, imageUrl, listEmpty 
}) => {
  const visibleStatus = useSelector(state => state.chat.statusModalInit)
  const dispatch = useDispatch()
  return <Modal
    centered
    visible={visibleStatus}
    title={chatInitGroup}
    onCancel={() => {
      set_state({ imageUrl: '', inputGroupName: '', usersData: [], usersDataAccum: []})
      dispatch(actions.modalInit(false))
    }}
    footer={null}
  >
    <Carousel
      dots={false}
      ref={carousel => carouselRef = carousel}>
      <div>
        <div>
          <div>
            <label
              style={{position: 'relative', left: '40%'}}
              htmlFor='avatarChatInit'
            >
              {/* <span style={styles.avatar_contain}> */}
                {imageUrl ? <img
                  src={imageUrl}
                  width={100}
                  height={100}
                  style={styles.avatarImg}
                /> : <span style={styles.avatarNull}><span style={{position: 'absolute', top: '40%', transform: 'translate(-50%, -40%)'}}>{uploadImage}</span></span>}
              {/* </span> */}
            </label>
            <input
              type = 'file'
              accept=".jpg, .jpeg, .png"
              id='avatarChatInit'
              style={{visibility: 'hidden', height: 1}}
              onChange = {(e) => setStateFile(e) }
            />
          </div>
          <div>{chatGroupTitle}</div>
          <Input
            value={inputGroupName}
            placeholder={chatGroupTitleEnter}
            onChange={event => set_state({ inputGroupName: event.target.value})}
          />
        </div>
        <div style={styles.btn__firstContainer} >
          <Button
            style={styles.btn}
            onClick={() => {
              const resultTrimValue = inputGroupName.trimLeft();
              if(resultTrimValue) {
                carouselRef.next()
              } else {
                notification['error']({
                  message: uncorrectData
                })
                set_state({ inputGroupName: event.target.value })
              }
            }}
          >
		  {Next}
          </Button>
        </div>
      </div>
      <div>
        <div>
          <div>{chatMembers}</div>
          <Select
            notFoundContent={fetching ? <Spin size="small" /> : listEmpty ? <div style={styles.listEmpty}>{userNotFound}</div> : null}
            placeholder={Search}
            mode="multiple"
            value={valueSelect}
            onChange={value => onChangeSelect(value)}
            onSearch={getListData}
            style={styles.select}
            size='large'
          >
            {usersData.map(userObj => (
              <Select.Option key={userObj.login}>
                {userObj.avatar === null ? <Avatar icon='user' /> : <Avatar src={userObj.avatar}/> }
                <span style={styles.option__name}>{userObj.login}</span>
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={styles.btn__secondContainer}>
          <Button
            onClick={() => carouselRef.prev()}
          >
		  {chatGoBack}
          </Button>
          <Button
            type='primary'
            onClick={() => createChatRoom()}
          >
			{Create}
          </Button>
        </div>
      </div>
    </Carousel>
  </Modal>
};

const enhance = compose(
  connect(
    () => ({}),
    dispatch => ({
      requestListChats: () => dispatch(actions.requestListChats()),
      actWithModal: flag => dispatch(actions.modalInit(flag))
    })
  ),
  withStateHandlers(
    ({
      inState = {
        inputGroupName: '',
        usersData: [],
        valueSelect: [],
        setUsersForSubmit: new Set(),
        objAvatarFile: {},
        imageUrl: '',
        fetching: false,
        listEmpty: false,
        usersDataAccum: []
      }
    }) => ({
      inputGroupName: inState.inputGroupName,
      usersData: inState.usersData,
      valueSelect: inState.valueSelect,
      setUsersForSubmit: inState.setUsersForSubmit,
      objAvatarFile: inState.objAvatarFile,
      imageUrl: inState.imageUrl,
      fetching: inState.fetching,
      listEmpty: inState.listEmpty,
      usersDataAccum: inState.usersDataAccum
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
    getListData: ({ set_state, usersDataAccum }) => (_substr) => {
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
        set_state({fetching: false})
        if(res.length===0) {
          set_state({listEmpty: true})
        }
        let arrUsers = []
        const preparedOptions = res.map((item, ind) => {
          const objUser = {
            login: item.login,
            avatar: item.photo === null ? null : api._url + item.photo[0]?.uri,
            id: item.id
          };

          if(usersDataAccum.length > 0 ) {
            const isIncludedElem = usersDataAccum.some(elem => elem.login === item.login);
            if(!isIncludedElem) arrUsers.push(objUser);
          }

          return objUser;
        });
        if(usersDataAccum.length === 0) {
          set_state({usersData: preparedOptions, usersDataAccum: preparedOptions});
        } else {
          set_state({usersData: preparedOptions, usersDataAccum: usersDataAccum.concat(arrUsers)});
        }
      })
    },
    onChangeSelect: ({ usersData, set_state, setUsersForSubmit, usersDataAccum }) => value => {
      setUsersForSubmit.clear();
      value.map(item => {
        usersDataAccum.forEach(it => {
          if(it.login === item){
            setUsersForSubmit.add(it.id);
          }
        });
      });
      set_state({
        valueSelect: value,
        setUsersForSubmit: setUsersForSubmit
      });
    },
    setStateFile: ({set_state}) => event => {
      const reader = new FileReader;
      const file = event.target.files[0];
      reader.addEventListener("load", function () {
        set_state({imageUrl: reader.result})
      }, false);
      if(file) {
        reader.readAsDataURL(file);
        set_state({objAvatarFile: file});
      }
    }
  }),
  withHandlers({
    createChatRoom: ({ setUsersForSubmit, inputGroupName, objAvatarFile, usersData, set_stateUpComponent, set_state, requestListChats, actWithModal }) => () => {
      if(usersData.length === 0) {
        notification['error']({
          message: chatNotCh
        });
        return;
      }

      const arrUsersForSubmit = [];
      setUsersForSubmit.forEach(item => {
        arrUsersForSubmit.push(item);
      });

      let _data;
      _data = new FormData();
      _data.append('file_0', objAvatarFile);
      _data.append('config', JSON.stringify({type:'image'}));
      _data.append('users', JSON.stringify(arrUsersForSubmit));
      _data.append('title', inputGroupName);

      objAvatarFile instanceof File ? null : _data = {
          config: {type: 'image'},
          users: arrUsersForSubmit,
          title: inputGroupName
        };
      apishka('POST', _data,'/api/dialog_group_create', (res) => {
        actWithModal(false)
        requestListChats()
        set_stateUpComponent({ statusCreateChat: true });
        notification['success']({
          message:chatCreatedGroup
        });
        set_state({
          setUsersForSubmit: new Set(), inputGroupName: '',
          objAvatarFile: {}, usersData: [],
          valueSelect: [], imageUrl: '',
          usersDataAccum: []
        });
      })

    },
  })
)

const styles = {
  btn__firstContainer: {
    textAlign: 'center'
  },
  btn__secondContainer: {
    display: 'flex',
    justifyContent: 'space-between',
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
  avatar_contain: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  avatarNull: {
    width: 100,
    height: 100,
    border: '1px dashed',
    borderRadius: '50%',
    display: 'inline-block',
    textAlign: 'center',
    position: 'relative',
    top: '50%',
    cursor: 'pointer'
  },
  avatarImg: {
    borderRadius: '50%',
    border: '1px solid',
    cursor: 'pointer'
  },
  listEmpty: {
    textAlign: 'center'
  }
};

export default enhance(ModalInit);
