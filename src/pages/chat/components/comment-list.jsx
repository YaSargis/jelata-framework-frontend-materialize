import React, { Fragment } from 'react';
import { useSelector } from "react-redux";
import { Avatar, Button, Tooltip, Spin, Modal, Icon, Input, List } from 'antd';
const { Search } = Input;
import moment from 'moment';
import { compose, lifecycle, withStateHandlers, withHandlers } from 'recompose';
import { HashLink as Link } from 'react-router-hash-link';
import {connect} from 'react-redux';

import { api } from 'src/defaults';
import { apishka } from 'src/libs/api';
import { get_chat_id, set_chat_id } from 'src/redux/actions/user';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { disableScroll, enableScroll } from 'src/libs/scroll-control';
import { Configer } from 'src/libs/methods';

let chatCreated = (((LaNg || {}).chatCreated ||{})[LnG || 'EN'] || 'created ')
let LoadinG = (((LaNg || {}).LoadinG ||{})[LnG || 'EN'] || 'Loading... ')
let chatPhoto = (((LaNg || {}).chatPhoto ||{})[LnG || 'EN'] || 'Photo:')
let Download = (((LaNg || {}).Download ||{})[LnG || 'EN'] || 'Download')
let chatFw = (((LaNg || {}).chatFw ||{})[LnG || 'EN'] || 'Forward message')
let chatRp = (((LaNg || {}).chatRp ||{})[LnG || 'EN'] || 'Reply message')
let ChangeD = (((LaNg || {}).ChangeD ||{})[LnG || 'EN'] || 'changed')
let Delete = (((LaNg || {}).Delete ||{})[LnG || 'EN'] || 'Delete')
let EdiT = (((LaNg || {}).EdiT ||{})[LnG || 'EN'] || 'Edit')
let CanceL = (((LaNg || {}).CanceL ||{})[LnG || 'EN'] || 'Cancel')
let areUSure = (((LaNg || {}).areUSure ||{})[LnG || 'EN'] || 'Are you sure?')
let getFilter = (((LaNg || {}).getFilter ||{})[LnG || 'EN'] || 'Search')
let chatRec = (((LaNg || {}).chatRec ||{})[LnG || 'EN'] || 'chatRec')
let Yes = (((LaNg || {}).Yes ||{})[LnG || 'EN'] || 'Yes')

const CommentList = ({ 
	refList, comments, removeComment, set_state, setStateUpComp, isCommentDelete, replyComment, globalSpin, filterChatRooms, dataFilteredChats, scrollToBottom,
    lastComment, refLastEl, scrollMore, isModalImgOpen, srcImage, scrollToAnchor, chatId, isModalForwardOpen, forwardMessage, valueSearch, isModalDeleteOpen, idDeleteComment
}) => {
  const listChats = useSelector(state => state.chat.listChats)
  const currentDialog = listChats.find(it => it.id === chatId);
  const createdTime = currentDialog !== undefined ? moment(currentDialog.created).format('HH:mm DD MMMM YYYY') : '';
  return <ul
      className='chat__list'
      ref={refList}
      style={styles.comments__list}
      onScroll={e => {
        let element = e.target;
        if(comments.length > 0) {
          if(element.scrollTop === 0) {
            set_state({isScrolled: true, elemTopScroll: comments[0].id});
            let sizeRow = comments.length + 20;
            scrollMore(sizeRow);
          }
        }
      }}
    >
    {globalSpin ? null : 
		comments.length > 0 ? 
			comments[0].isfirst ? (
				<div style={styles.createInfo}><span style={{fontWeight: 'bolder'}}>{currentDialog?.creator?.login}</span> {chatCreated} {createdTime}</div>
				)
			: null
		: (
			<div style={styles.createInfo}><span style={{fontWeight: 'bolder'}}>{currentDialog.creator.login}</span> {chatCreated} {createdTime}</div>
		)
	}
    { globalSpin ? <Spin style={{margin: 'auto', fontSize: 30}} tip={LoadinG} size='large' /> : comments.map((item, ind) => {
      const colorMyComment = item.ismine ? 'chat__listItem--ismine' : 'chat__list__item';

      const currentDate = moment();
      const diffHours = moment.duration(currentDate.diff(item.created)).asHours();

      const currentItemDate = moment(item.created).format('DD MMMM YYYY');
      const nextItemDate = ind < comments.length - 1 ? moment(comments[ind+1].created).format('DD MMMM YYYY') : false;
      return <Fragment key={item.id}>
        <li
          ref={lastComment.id === item.id ? refLastEl : null}
          key={item.id}
          id={item.id}
          style={styles.comments__li}>
            <div style={styles.comments__avatar}>
              {item.photo?.length > 0 ? <Avatar size={42} className='chat__avatar' src={api._url + item.photo[0].uri} /> : <Avatar size={42} icon='user' /> }
            </div>
            <ContextMenuTrigger id={`${item.id}`}>
              <div
                style={{minWidth: 200}}
                className={colorMyComment}
              >
                <div style={styles.comments__itemContainer}>
                  <div style={styles.comments__itemAuthor}>{item.login}</div>
                  { item.forwarded_from !== null ? <span style={{fontWeight: 'bolder'}}>Переслано от <span style={{backgroundColor: '#c8c8c8', color: '#4586c2', fontWeight: 'bolder', padding: '0 5px', borderRadius: 10}}>{item.forwarded_from_user}</span></span> : null}
                  <div style={{display: 'flex', justifyContent: 'flex-end', width: 70}}>
                    <div style={styles.comments__itemDatetime}>{moment(item.created).format('HH:mm')}</div>
                  </div>
                </div>
                {item.reply_message ? (
					<Link to={`chats#${item.reply_message.id}`} 
						scroll={el => {
							scrollToAnchor(el, item.reply_message.id)
							window.history.pushState("", document.title, window.location.pathname + window.location.search);
						}}
					>
						<div onClick={() => {
							const isAnchorExist = comments.some(it => it.id === item.reply_message.id);
								if (!isAnchorExist) {
									apishka(
										'GET', {}, '/api/dialog_messages?dialogid=' + chatId + '&reply_to=' + item.reply_message.id,
										(res) => {
											setStateUpComp({ comments: res.outjson});
										}
									)
								}
							}} style={{borderLeft: '3px solid #37a1de', margin: '5px 0 5px 20px', padding: '5px 0 5px 5px'}}
						>
							<span style={{...styles.comments__itemAuthor, backgroundColor: '#c8c8c8', color: '#4586c2', fontWeight: 'bolder'}}>{item.reply_message.login}</span>
							<div>{item.reply_message.message_text.length > 100 ? item.reply_message.message_text.split('\n').map((it, key) => {
									return <span key={key}>{it.slice(0, 100).concat('...')}<br/></span>
								}) : item.reply_message.message_text}
							</div>
							{item.reply_message.files.length > 0 ? (
								<div style={{backgroundColor: 'aliceblue', padding: '0 5px', borderRadius: 10}}>
									{item.reply_message.files[0].filename}
								</div>
							) : null}
							{item.reply_message.images.length > 0 ? (
								<div>
									<div><span style={{backgroundColor: 'aliceblue', margin: '2px 0', padding: '0 5px', borderRadius: 10}}>{chatPhoto}</span></div>
										<img src={api._url + item.reply_message.images[0].uri} height={40} />
								</div>
							): null}
						</div>
					</Link>
				) : null}
				{item.images.length > 0 ? item.id === isCommentDelete ? (
						<Spin style={{marginLeft: 20, marginTop: 10}}  />
					) : item.images.map(it => (
							<div key={it.uri} style={{borderRadius: 10, border: 'black', height: 200, cursor: 'pointer', marginTop: 5}} >
								<img src={api._url + it.uri} height={200} onClick={()=>set_state({isModalImgOpen: true, srcImage: api._url + it.uri})} />
							</div>
						)) 
					: null
				}

				{ item.files.length > 0 ? item.id === isCommentDelete ? <Spin style={{marginLeft: 20, marginTop: 10}} /> : <div key={item.id + 'files'}>
                  <div style={{marginTop: 10}}>
                    <span
                      style={{fontSize: 12, backgroundColor: 'aliceblue', fontWeight: 'bolder', padding: 5, borderRadius: 10}}
                    >
                      Файл:
                    </span>
                    </div>
                  <ul className='getone__filelist'
                      style={{backgroundColor: 'aliceblue', borderRadius: 10 }}
                  >{item.files.map((file) => (
                    <li key={file.uri} className='getone__filelist-item'>
                      <div style={{paddingLeft: 20}}>{file.label || file.filename}</div>
                      <div style={{paddingLeft: 40, paddingRight: 20}}>
                        <Tooltip title={Download} placement='topLeft'>
							<Button icon='download' size='small' shape='circle' style={{border: '1px solid grey'}} onClick={() => window.open(api._url + file.uri)} />
				  		</Tooltip>
                      </div>
                    </li>))}
                  </ul>
                </div> : null }

                <div style={styles.comments__itemContent}>{ item.message_text ? item.id === isCommentDelete ? <Spin /> : item.message_text.split('\n').map((it, key) => {
                  return <span key={key}>{it}<br/></span>
                }) : null }</div>
                {item.isupdated ? <div style={{textAlign: 'right', fontSize: 10, fontWeight: 'bolder'}}>{ChangeD}</div> : null}
              </div>
            </ContextMenuTrigger>
			<ContextMenu
				id={`${item.id}`}
				className='react-contextmenu-wrapper'
				onShow={() => disableScroll()}
				onHide={() => enableScroll()}
			>
				<MenuItem onClick={() => replyComment(item)}>{chatRp}</MenuItem>
				<MenuItem onClick={() => set_state({isModalForwardOpen: true, commentForwardID: item.id})}>{chatFw}</MenuItem>
					{item.ismine ?
						(item.files.length > 0 || item.images.length > 0) ? 
							null
							: item.forwarded_from ? null : diffHours > 24 ?
								null
								: (
									<MenuItem
										onClick={() => {
											setStateUpComp({
												isModalEditOpen: true, commentForEdit: item
											});
										}}
									>
										{EdiT}
									</MenuItem>
								)
							: null 
					}
					{item.ismine ? <MenuItem onClick={()=> set_state({isModalDeleteOpen: true, idDeleteComment: item.id})}>{Delete}</MenuItem> : null }
			</ContextMenu>
        </li>
        {/*   date block  */}
        {(() => {
                  if(ind !== comments.length -1) {
                     switch(currentItemDate) {
                      case nextItemDate:
                        return null;
                      default:
                        return (
                        <div style={styles.createInfo}>{nextItemDate}</div>
                        );
                    }
                  }
                })()}
      </Fragment>
    })}

    { comments.length > 0 ? <div style={{fontSize: 40, position: 'absolute', top: '80%', left: '95%'}}>
      <Icon type='down-circle' onClick={() => scrollToBottom()} />
    </div> : null }

    <Modal
      width={250}
      title={Delete}
      centered
      visible={isModalDeleteOpen}
      okText={Yes}
      okButtonProps={{type: 'danger'}}
      onOk={()=>removeComment(idDeleteComment)}
      onCancel={()=>set_state({isModalDeleteOpen: false, idDeleteComment: null })}
    >
      <div style={{fontSize: 30}}>{areUSure}</div>
    </Modal>
    <Modal
      centered
      footer={null}
      visible={isModalImgOpen}
      width={'max-content'}
      onCancel={() => set_state({isModalImgOpen: false})}
    >
      <img src={srcImage} height={700} />
    </Modal>
    <Modal
      centered
      footer={<Button onClick={()=>set_state({isModalForwardOpen: false, commentForwardID: null, valueSearch: '', dataFilteredChats: []})} >{CanceL}</Button>}
      title={chatRec}
      visible={isModalForwardOpen}
      onCancel={() => set_state({isModalForwardOpen: false, commentForwardID: null, valueSearch: '', dataFilteredChats: []})}
    >
      <Search
        placeholder={getFilter}
        value={valueSearch}
        onChange={e => filterChatRooms(e.target.value)}
      />
      <List
        style={{maxWidth: 600, marginTop: 10, minHeight: 200}}
        bordered
        dataSource={valueSearch === '' ? listChats : dataFilteredChats}
        renderItem={it => (
          <List.Item style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{marginLeft: 10}}>
              <Avatar icon='group' src={it.photo?.length > 0 ? api._url + it.photo[0].uri : false} />
            </div>
            <div>{it.title}</div>
            <div style={{marginRight: 10}}>
              <Button
                onClick={() => forwardMessage(it.id)}
                type='primary'
              >
				{chatFw}
              </Button>
            </div>
          </List.Item>
        )}
      />
    </Modal>
  </ul>
};

const enhance = compose(
  connect(
    state => ({
      chatId: state.user.chatId
    }),
    dispatch => ({
      get_chat_id: () => dispatch(get_chat_id()),
      set_chat_id: id => dispatch(set_chat_id(id))
    })
  ),
  withStateHandlers(
    ({
      inState = {
        refList: React.createRef(),
        visiblePopover: false,
        refLastEl: React.createRef(),
        isScrolled: false,
        elemTopScroll: null,
        isModalImgOpen: false,
        isModalForwardOpen: false,
        isModalDeleteOpen: false,
        srcImage: null,
        commentForwardID: null,
        valueSearch: '',
        dataFilteredChats: [],
        idDeleteComment: null
      }
    }) => ({
      refList: inState.refList,
      visiblePopover: inState.visiblePopover,
      refLastEl: inState.refLastEl,
      isScrolled: inState.isScrolled,
      elemTopScroll: inState.elemTopScroll,
      isModalImgOpen: inState.isModalImgOpen,
      isModalForwardOpen: inState.isModalForwardOpen,
      isModalDeleteOpen: inState.isModalDeleteOpen,
      srcImage: inState.srcImage,
      commentForwardID: inState.commentForwardID,
      valueSearch: inState.valueSearch,
      dataFilteredChats: inState.dataFilteredChats,
      idDeleteComment: inState.idDeleteComment
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
    removeComment: ({ setStateUpComp, set_state }) => (id) => {
      set_state({idDeleteComment: null, isModalDeleteOpen: false})
      setStateUpComp({isCommentDelete: id});
      apishka('DELETE', {id:id}, '/api/dialog_delete_message', () => {}, (err) => {  setStateUpComp({isCommentDelete: false})} )
    },
    replyComment: ({ setStateUpComp }) => comment => {
      setStateUpComp({answerComment: {
        id: comment.id,
        text: comment.message_text,
        login: comment.login
      }});
    },
    scrollMore: ({chatId, setStateUpComp, comments, set_state}) => sizeRow => {
      const isFirstCommentExist = comments.some(item => item.isfirst === true);
      if(isFirstCommentExist) {
        set_state({elemTopScroll: null, isScrolled: false});
      } else {
        apishka(
          'GET', {}, '/api/dialog_messages?dialogid=' + chatId + '&pagesize=' + sizeRow,
          (res) => {
            setStateUpComp({ comments: res.outjson});
          }
        )
      }
    },
    scrollToAnchor: ({comments, chatId, setStateUpComp}) => (elem, id) => {
      const isAnchorExist = comments.some(item => item.id === id);
      if(!isAnchorExist) {
        apishka('GET', {}, '/api/dialog_messages?dialogid=' + chatId + '&reply_to=' + id, (res) => {
            setStateUpComp({ comments: res.outjson});
        })
      }
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      elem.classList.add('color-change-2x');

      window.setTimeout(() => {
        elem.classList.remove('color-change-2x');
      }, 4000)
    },
    forwardMessage: ({commentForwardID, set_state, set_chat_id}) => id => {
      apishka('POST', {dialogid: id, forwarded_from: commentForwardID}, '/api/dialog_message_send', (res) => {
        set_state({commentForwardID: null, valueSearch: '', dataFilteredChats: [], isModalForwardOpen: false});
        set_chat_id(id);
      })
    },
    filterChatRooms: ({listChats, set_state}) => value => {
      const _value = value.toLocaleLowerCase();
      const filteredChats = listChats.filter(item => item.title.toLocaleLowerCase().includes(_value));
      set_state({dataFilteredChats: filteredChats, valueSearch: value});
    },
    scrollToBottom: ({ refList, refLastEl, comments}) => () => {
      if(comments.length > 0) refList.current.scrollTo({ top: refLastEl.current.offsetTop, behavior: 'smooth' });
    }
  }),
  lifecycle({
    componentDidMount(){
      const { get_chat_id } = this.props;
      get_chat_id();
    },
    componentDidUpdate(prevProps){
      const { refList, comments, refLastEl, setStateUpComp, changedId, isSubmit, set_state, isScrolled, elemTopScroll } = this.props;
      if(prevProps.comments !== comments) {
        if(comments.length > 0) {
          if(isScrolled) {
            document.getElementById(elemTopScroll).scrollIntoView({block: 'start'});
            set_state({elemTopScroll: null, isScrolled: false});
          }
          if( changedId === true) {
            setStateUpComp({changedId: false});
            refList.current.scrollTo(0, refLastEl.current.offsetTop);
          }
          if(comments[comments.length - 1].ismine === true && isSubmit === true) {
            refList.current.scrollTo(0, refLastEl.current.offsetTop);
            setStateUpComp({isSubmit: false});
          }
        }
      }
    },
  })
);

const styles = {
  comments__list: {
    padding: 0,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    listStyle: 'none',
    marginBottom: 0,
    height: '100%',
    background: `no-repeat url('./files/fon4.jpg')`,
    backgroundOrigin: 'border-box',
    backgroundPosition: 'center'
  },
  comments__li: {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: 10,
    minWidth: 100,
    paddingLeft: 40,
    boxSizing: 'border-box'
  },
  comments__avatar: {
    marginRight: 20,
    borderRadius: '50%'
  },
  comments__itemContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  comments__itemAuthor: {
    margin: '0 10px',
    color: 'aliceblue',
    fontSize: 14,
    backgroundColor: '#4586c2',
    padding: '0 4px',
    borderRadius: 10
  },
  comments__itemDatetime: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4d524c'
  },
  comments__itemContent:{
    marginLeft: 20,
    padding: '5px 0'
  },
  createInfo: {
    margin: '10px auto',
    borderRadius: 10,
    padding: 5,
    backgroundColor: 'tan'
  }
};

export default enhance(CommentList);
