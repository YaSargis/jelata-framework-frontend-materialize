import React from 'react';
import { connect, useSelector } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import moment from 'moment';
import qs from 'qs'

import { apishka, typeReq } from 'src/libs/api';
import { set_chat_id } from 'src/redux/actions/user';
import { actions } from '../reducer'
import { Avatar, Button, Modal, List, Input, Popconfirm, Empty, Icon, notification } from 'antd';
const { Search } = Input;

let Yes = (((LaNg || {}).Yes ||{})[LnG || 'EN'] || 'Yes')
let ChangeD = (((LaNg || {}).ChangeD ||{})[LnG || 'EN'] || 'changed')
let Delete = (((LaNg || {}).Delete ||{})[LnG || 'EN'] || 'Delete')
let EdiT = (((LaNg || {}).EdiT ||{})[LnG || 'EN'] || 'Edit')
let CanceL = (((LaNg || {}).CanceL ||{})[LnG || 'EN'] || 'Cancel')
let areUSure = (((LaNg || {}).areUSure ||{})[LnG || 'EN'] || 'Are you sure?')
let getFilter = (((LaNg || {}).getFilter ||{})[LnG || 'EN'] || 'Search')
let chatCreated = (((LaNg || {}).chatCreated ||{})[LnG || 'EN'] || 'created ')
let SearcH = (((LaNg || {}).Search ||{})[LnG || 'EN'] || 'Search ')
let chatAdmin = (((LaNg || {}).chatAdmin ||{})[LnG || 'EN'] || 'admin')
let chatAdmininstrator = (((LaNg || {}).chatAdmininstrator ||{})[LnG || 'EN'] || 'Administrator')
let createDate = (((LaNg || {}).createDate ||{})[LnG || 'EN'] || 'Created:')
let chatChangeTitle = (((LaNg || {}).chatChangeTitle ||{})[LnG || 'EN'] || 'Change title')
let chatChangePhoto = (((LaNg || {}).chatChangePhoto ||{})[LnG || 'EN'] || 'Change photo')
let OwneR = (((LaNg || {}).OwneR ||{})[LnG || 'EN'] || 'Owner')
let chatAddAdmin = (((LaNg || {}).chatAddAdmin ||{})[LnG || 'EN'] || 'Add admin')
let chatDeleteAdmin = (((LaNg || {}).chatDeleteAdmin ||{})[LnG || 'EN'] || 'Delete admin')
let chatMembers = (((LaNg || {}).chatMembers ||{})[LnG || 'EN'] || 'Chat members')
let chatAddMember = (((LaNg || {}).chatAddMember ||{})[LnG || 'EN'] || 'Add member')
let chatDeleteMember = (((LaNg || {}).chatDeleteMember ||{})[LnG || 'EN'] || 'Delete member')
let chatLeaveTheGroup = (((LaNg || {}).chatLeaveTheGroup ||{})[LnG || 'EN'] || 'eave the group')
let chatChImage = (((LaNg || {}).chatChImage ||{})[LnG || 'EN'] || 'Choose the image')
let Addd = (((LaNg || {}).Add ||{})[LnG || 'EN'] || 'Add')
let showAll = (((LaNg || {}).showAll ||{})[LnG || 'EN'] || 'Show all')

const ControlPanel = ({ 
	chatId, setStateUpComp, set_state, isModalDelMemberOpen, filterUsers, selectedUser, deleteSelf, isAddAdmin,
	deleteUser, valueSearch, showAllUsers, isModalAddMemberOpen, findUser, findedUsers, addUser, isModalAdminOpen, addAdmin,
	deleteAdmin, changeGroupSet, isModalMainOpen, valueTitle, isModalPicOpen, imageUrl, setStateFile, objAvatarFile
}) => {
  const listChats = useSelector(state => state.chat.listChats)
  const chat = listChats.find(obj => obj.id === chatId);
  const creator = chat.creator;
  const admins = chat.dialog_admins.filter(item => item !== creator.id);
  const adminsObj = admins.map(item => {
    for(let i = 0; i < chat.users.length; ++i){
      if(item === chat.users[i].id) {
        return chat.users[i];
      }
    }
  });

	return (
		<React.Fragment>
			<div>
				<div>
					<div style={{textAlign: 'center'}}>{createDate} </div>
					<div style={{textAlign: 'center', fontWeight: 'bolder', fontSize: 24}}>
						{moment(chat.created).format('DD.MM.YYYY')}
					</div>
				</div>
				{ chat.dialog_type_name === 'group' ? (
						<div style={{margin: '20px 0', borderRadius: 10, ...styles.buttons}}>
							<Button onClick={()=>set_state({isModalMainOpen: true})}>{chatChangeTitle}</Button>
							<Button onClick={()=>set_state({isModalPicOpen: true})}>{chatChangePhoto}</Button>
						</div>
					) : null 
				}
				<div>
					<div>{chatAdmininstrator}</div>
					<div style={styles.admins}>
						<div>
							<div style={{textAlign: 'center', fontSize: 20, height: 25}}><Icon type='crown' /></div>
							<Avatar
							  icon="user"
							  src={creator.photo[0]?.src}
							  size={46}
							/>
							<div style={styles.login}>{creator.login}</div>
							<div style={{fontSize: 10, textAlign: 'center'}}>{OwneR}</div>
						</div>
						{adminsObj.map(item => (
							<div key={item.login + 'admins'}>
								<Avatar
									icon="user"
									src={item.photo[0]?.src}
									size={46}
								/>
								<div style={styles.login}>{item.login}</div>
								<div style={{fontSize: 10, textAlign: 'center'}}>{chatAdmin}</div>
							</div>
						))}
					</div>
				</div>
				{chat.dialog_type_name === 'group' ? chat.isadmin ? (
						<div style={styles.buttons}>
							<Button size='small' type='primary' onClick={()=> set_state({isModalAdminOpen: true, isAddAdmin: true})}>{chatAddAdmin}</Button>
							<Button size='small' type='danger' onClick={() => set_state({isModalAdminOpen: true})}>{chatDeleteAdmin}</Button>
						</div>
					)	
					: null : null
				}
				<div style={{marginTop: 20}}>
					<div>{chatMembers}</div>
					<div style={styles.members}>
						{ chat.users ? chat.users.map(item => (
								<div key={item.login}>
									<Avatar
										icon="user"
										src={item.photo !== null ? item.photo[0]?.src : false}
										size={46}
									/>
									<div style={styles.login}>{item.login}</div>
								</div>
							)) : <Empty />
						}
					</div>
				</div>
			</div>
			{ chat.dialog_type_name === 'group' ? chat.isadmin ? ( 
				<div style={styles.buttons}>
					<Button
						size='small'
						type='primary'
						onClick={() => set_state({isModalAddMemberOpen: true})}
					>
						{chatAddMember}
					</Button>
					<Button
						size='small'
						type='danger'
						onClick={() => {
						  setStateUpComp({ openDrawerPanel: false });
						  set_state({isModalDelMemberOpen: true});
						}}
					>
						{chatDeleteMember}
					</Button>
				</div>
			) : null : null }
			{chat.dialog_type_name === 'group' ? (
				<div style={{marginTop: 40, textAlign: 'center'}}>
					<Popconfirm
						title={areUSure}
						okText={Yes}
						cancelText={CanceL}
						onConfirm={() => deleteSelf()}
					>
						<Button type='danger'>{chatLeaveTheGroup}</Button>
					</Popconfirm>
				</div>
			) : null }
			<Modal
				centered
				title={chatChangeTitle}
				visible={isModalMainOpen}
				onCancel={() => set_state({isModalMainOpen: false})}
				onOk={()=> changeGroupSet('title', valueTitle)}
			>
				<Input
					value={valueTitle}
					onChange={e=>set_state({valueTitle: e.target.value})}
				/>
			</Modal>
			<Modal
				centered
				  title={chatChangePhoto}
				  visible={isModalPicOpen}
				  onCancel={()=>set_state({isModalPicOpen: false, objAvatarFile: {}, imageUrl: ''})}
				  onOk={()=>changeGroupSet('image', objAvatarFile)}
			>
				<div>
					<label
					  htmlFor='avatarChangePic'
					>
						<div style={styles.avatar_contain}>
							{imageUrl ? (
									<img
										src={imageUrl}
										width={400}
										style={styles.avatarImg}
									/>
								) 
								: <div style={styles.avatarNull}>{chatChImage}</div>
							}
						</div>
					</label>
					<input
						type = 'file'
						accept='image/*'
						id='avatarChangePic'
						style={{visibility: 'hidden', height: 1}}
						onChange = {(e) => setStateFile(e) }
					/>
				</div>
			</Modal>
			<Modal
				centered
				title={chatDeleteMember}
				onCancel={()=>set_state({isModalDelMemberOpen: false, selectedUser: [], valueSearch: ''})}
				visible={isModalDelMemberOpen}
				footer={<Button onClick={()=>set_state({isModalDelMemberOpen: false, selectedUser: [], valueSearch: ''})} >{CanceL}</Button>}
			>
				<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20, marginTop: 20}}>
					<Button onClick={()=>showAllUsers()} type="primary">
						{showAll}
					</Button>
					<Search
						placeholder={Search}
						style={{ width: 300 }}
						onSearch={value => filterUsers(value)}
						value={valueSearch}
						onChange={e => set_state({valueSearch: e.target.value})}
					/>
				</div>
				<List
					bordered
					dataSource={selectedUser}
					renderItem={item => {
						return (
							<List.Item style={{display: 'flex', justifyContent: 'space-around'}} key={item.id}>
								<Avatar icon='user' src={item.photo[0]?.src} />
								<div>{item.login}</div>
								<Popconfirm
									title={areUSure}
									okText={Yes}
									cancelText={CanceL}
									onConfirm={() => deleteUser(item.id)}
								>
								<Button type='danger'>
									{Delete}
								</Button>
								</Popconfirm>
							</List.Item>
						)
					}}
				/>
			</Modal>
			<Modal
				centered
				title={chatAddMember}
				onCancel={()=>set_state({isModalAddMemberOpen: false, valueSearch: '', findedUsers: []})}
				visible={isModalAddMemberOpen}
				footer={<Button onClick={()=>set_state({isModalAddMemberOpen: false, valueSearch: '', findedUsers: []})} >{CanceL}</Button>}
			>
				<div style={{display: 'flex', justifyContent: 'added', marginBottom: 20, marginTop: 20}}>
					<Search
						placeholder={SearcH}
						style={{ width: 300 }}
						onSearch={ findUser }
						value={valueSearch}
						onChange={e => set_state({valueSearch: e.target.value})}
					/>
				</div>
				<List
					bordered
					dataSource={findedUsers}
					renderItem={item => {
						return (
							<List.Item style={{display: 'flex', justifyContent: 'space-around'}} key={item.id}>
								<Avatar icon='user' src={item.photo[0]?.src} />
								<div>{item.login}</div>
								<Button
								  type='primary'
								  onClick={() => addUser(item.id)}
								>
								{Addd}
								</Button>
							</List.Item>
						)
					}}
				/>
			</Modal>
			<Modal
				centered
				title={isAddAdmin ? chatAddAdmin : chatDeleteAdmin}
				visible={isModalAdminOpen}
				onCancel={()=>set_state({isModalAdminOpen: false, valueSearch: '', selectedUser: [], isAddAdmin: false})}
				footer={<Button onClick={()=>set_state({isModalAdminOpen: false, valueSearch: '', selectedUser: [], isAddAdmin: false})} >{CanceL}</Button>}
			>
				<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20, marginTop: 20}}>
					<Button onClick={()=>showAllUsers()} type="primary">
						Показать всех
					</Button>
					<Search
						placeholder={SearcH}
						style={{ width: 300 }}
						onSearch={value => filterUsers(value)}
						value={valueSearch}
						onChange={e => set_state({valueSearch: e.target.value})}
					/>
				</div>
				<List
					bordered
					dataSource={selectedUser}
					renderItem={item => {
						return (
							<List.Item style={{display: 'flex', justifyContent: 'space-around'}} key={item.id}>
								<Avatar icon='user' src={item.photo[0]?.src} />
								<div>{item.login}</div>
								{isAddAdmin ? 
									item.isadmin ? (
										<Button disabled>{chatAdmin}</Button>
									) : (
										<Popconfirm
											title={areUSure}
											okText={Yes}
											cancelText={CanceL}
											onConfirm={() => addAdmin(item.id)}
										>
									
											<Button type={isAddAdmin ? 'primary': 'danger'}>
												{ isAddAdmin ? Addd : Delete }
											</Button>
										</Popconfirm>
									)
									: item.isadmin ? (
										<Popconfirm
											title={areUSure}
											okText={Yes}
											cancelText={CanceL}
											onConfirm={() => deleteAdmin(item.id)}
										>
											<Button type={isAddAdmin ? 'primary': 'danger'}>
												{ isAddAdmin ? Addd : Delete }
											</Button>
										</Popconfirm>
									)
									  : <Button disabled>{chatMembers}</Button>
								}
							</List.Item>
						)
					}}
				/>
			</Modal>
		</React.Fragment>
	)
};

const enhance = compose(
  connect(
    state => ({
      listChats: state.chat.listChats
    }),
    dispatch => ({
      set_chat_id: id => dispatch(set_chat_id(id)),
      requestListChats: () => dispatch(actions.requestListChats())
    })
  ),
  withStateHandlers(
    ({
      inState = {
        isModalDelMemberOpen: false,
        isModalAddMemberOpen: false,
        isModalMainOpen: false,
        selectedUser: [],
        valueSearch: '',
        isShowAllUsers: false,
        findedUsers: [],
        isAddAdmin: false,
        valueTitle: '',
        imageUrl: '',
        objAvatarFile: {},
      }
    }) => ({
      isModalDelMemberOpen: inState.isModalDelMemberOpen,
      isModalAddMemberOpen: inState.isModalAddMemberOpen,
      isModalMainOpen: inState.isModalMainOpen,
      selectedUser: inState.selectedUser,
      valueSearch: inState.valueSearch,
      isShowAllUsers: inState.isShowAllUsers,
      findedUsers: inState.findedUsers,
      isAddAdmin: inState.isAddAdmin,
      valueTitle: inState.valueTitle,
      imageUrl: inState.imageUrl,
      objAvatarFile: inState.objAvatarFile
    }),
    {
      set_state: state => obj => {
        let _state = {...state},
            keysObj = Object.keys(obj);
        keysObj.map(key => _state[key] = obj[key]);
        return _state;
      }
    }
  ),
  withHandlers({
    filterUsers: ({ listChats, chatId, set_state}) => value => {
      set_state({isShowAllUsers: false});
      const _value = value.toLocaleLowerCase();
      const chat = listChats.find(obj => obj.id === chatId);
      const filteredUsers = chat.users.filter(item => item.login.toLocaleLowerCase().includes(_value));
      set_state({selectedUser: filteredUsers})
    },
    deleteUser: ({chatId, set_chat_id, set_state, requestListChats }) => id => {
      apishka(
        typeReq.delete, 
        { id: chatId, user_to_remove: id },
        '/api/dialog_removeuser',
        () => {
          set_state({selectedUser: [], isModalDelMemberOpen: false, valueSearch: ''});
          requestListChats();
          set_chat_id(chatId);
        }
      )
    },
    showAllUsers: ({ listChats, chatId, set_state, }) => () => {
      const chat = listChats.find(obj => obj.id === chatId);
      set_state({selectedUser: chat.users, isShowAllUsers: true});
    },
    findUser: ({set_state}) => value => {
      if(value === '') return;
      const queryString = qs.stringify({ substr: value })
      apishka(
        typeReq.get,
        {}, 
        '/api/dialogs_usersearch?' + queryString,
        (res) => {
          let _data = _.sortBy(res.outjson, ['login']);
          set_state({ findedUsers: _data });
        }
      )
    },
    addUser: ({chatId, set_chat_id, set_state, requestListChats}) => id => {

      apishka('POST', {user_to_add: id,id: chatId}, '/api/dialog_adduser', () => {
        set_state({findedUsers: [], isModalAddMemberOpen: false, valueSearch: ''});
        requestListChats();
        set_chat_id(chatId);
      })
    },
    deleteSelf: ({chatId, set_chat_id, setStateUpComp, requestListChats}) => () => {
      apishka('POST', {id: chatId}, '/api/dialog_leave', () => {
        setStateUpComp({openDrawerPanel: false});
        set_chat_id(false);
        requestListChats()
      })
    },
    addAdmin: ({chatId, set_state, requestListChats}) => id => {
      apishka('POST', {user_to_add: id, id: chatId}, '/api/dialog_addadmin', () => {
        set_state({selectedUser: [], isModalAdminOpen: false, valueSearch: '', isAddAdmin: false});
        requestListChats()
        set_chat_id(chatId);
      }, (err) => {
        set_state({selectedUser: [], isModalAdminOpen: false, valueSearch: '', isAddAdmin: false})
      })
    },
    deleteAdmin: ({chatId, set_state, requestListChats}) => id => {
      apishka('DELETE', {admin_to_remove: id, id: chatId}, '/api/dialog_removeadmin',
        () => {
          set_state({selectedUser: [], isModalAdminOpen: false, valueSearch: '', isAddAdmin: false});
          requestListChats()
        },
        (err) => {
          set_state({selectedUser: [], isModalAdminOpen: false, valueSearch: '', isAddAdmin: false})
        }
      )
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
    },
    changeGroupSet: ({chatId, set_state, objAvatarFile, requestListChats }) => (type, value) => {
      if(type==='title') {
        apishka('POST', {id: chatId, title: value}, '/api/dialog_edit', () => {
            set_state({valueTitle: '', isModalMainOpen: false});
            requestListChats()
            notification['success']({
              message: ChangeD
            })
          }
        )
      } else {
        let _data = new FormData();
        _data.append('file_0', objAvatarFile);
        _data.append('config', JSON.stringify({type:'image'}));
        _data.append('id', chatId);
        apishka('POST', _data, '/api/dialog_edit', () => {
            set_state({objAvatarFile: {}, isModalPicOpen: false, imageUrl: ''});
            requestListChats()
            notification['success']({
              message: ChangeD
            })
          }
        )

      }
    }
  })
)

const styles= {
  admins: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    backgroundColor: '#bafdaf',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10
  },
  login: {
    textAlign: 'center',
    backgroundColor: '#4686bf',
    color: 'aliceblue',
    borderRadius: 10,
    fontSize: 12,
    padding: '0 2px'
  },
  members: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#bafdaf',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ccc'
  },
  avatar_contain: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  avatarNull: {
    width: 100,
    height: 100,
    border: '1px dashed',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
};

export default enhance(ControlPanel);
