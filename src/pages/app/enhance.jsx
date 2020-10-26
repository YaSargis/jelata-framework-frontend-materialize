import React from 'react';
import { compose, withHandlers, lifecycle, withState } from 'recompose';
import _ from 'lodash';
import { notification, Avatar, Icon } from 'antd';

import { menu_creator, saveUserSettings } from 'src/libs/methods';
import { apishka } from 'src/libs/api';
import { api } from 'src/defaults';

let chatSocket;


const enhance = compose(
	withState('custom_menu', 'changeMenu', []), // menus array
	withState('user_detail', 'changeUserDetail', {}), // user details
	withState('collapsed', 'changeCollapsed', false), // preloader

	withHandlers({
		getMenu: ({ changeMenu, changeUserDetail, changeLoading }) => () => {
			apishka( 'GET', {}, '/api/menus', (res) => {
				changeMenu(res.outjson.menus)
				changeUserDetail(res.outjson.userdetail)
				localStorage.setItem('usersettings', JSON.stringify(res.outjson.userdetail.usersettings))
				localStorage.setItem('homepage', res.outjson.homepage)
				localStorage.setItem('ischat', res.outjson.ischat)
				localStorage.setItem('redirect401', res.outjson.redirect401)
				localStorage.setItem('login_url', res.outjson.login_url)
			},
			(err) => {
				console.log('err menus:', err)
			})
		},
		menu_creator: menu_creator,
		menuCollapseStateSave: ({changeCollapsed}) => (collapseState) => {
			let userSettings = JSON.parse(localStorage.getItem('usersettings')) || {views:{}}
			userSettings['menuCollapse'] = collapseState
			saveUserSettings(userSettings)
			localStorage.setItem('usersettings',JSON.stringify(userSettings))
			changeCollapsed(collapseState)
		}
	}),
	withHandlers({
		handleGlobalWS: ({ getMenu}) => () => {
			let ws = document.location.href.split('//')[1];
			let ws_protocol = document.location.href.split('//')[0].indexOf('s') !== -1? 'wss' : 'ws'
			console.log('ws_protocol', ws_protocol)
			ws = ws.split('/')[0];
			  
			ws = ws_protocol + '://' + ws + '/global_ws'
			let globalSocket = new WebSocket(ws);
			globalSocket.onopen = () => {
				globalSocket.send(JSON.stringify({}));
			};
			globalSocket.onmessage = (e) => {
				let globalData = JSON.parse(e.data)
				globalData.forEach((g_item) => {
					notification.success({
						message:g_item.message
					})
					apishka('GET',  {id: g_item.id},  '/api/setsended')
				})
				getMenu()
			}
		},
	}),
    lifecycle({
		componentDidMount(){
			const { changeCollapsed, handleGlobalWS, getMenu} = this.props;
			let userSettings = JSON.parse(localStorage.getItem('usersettings'))
			if (userSettings && userSettings.menuCollapse !== undefined) {
				changeCollapsed(userSettings.menuCollapse)
			}

			/* create client session */
			let sesid = localStorage.getItem('sesid')
			if (!sesid) {
				sesid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15 >> c/4).toString(16))
				localStorage.setItem('sesid', sesid)
			}
			document.cookie = 'sesid=' + sesid

			/* redirect401 */
			let redirect401 = localStorage.getItem('redirect401')
			if (!redirect401) {
				localStorage.setItem('redirect401', '/login')
			}

			/* login url */
			let login_url = localStorage.getItem('login_url')
			if (!login_url) {
				localStorage.setItem('login_url', '/login')
			}

			getMenu();
			// handleChatWS();
			handleGlobalWS();
		},
		UNSAFE_componentWillMount() {
			let body = document.getElementsByTagName('body')[0];
			body.classList.remove("login_bckg");
		},
		componentDidUpdate(prevProps){
			const { chatId, set_first_id, location, handleChatWS, set_chat_id, handleGlobalWS } = this.props;

			if(prevProps.chatId !== chatId) {
				chatSocket.close();
				handleChatWS();
			}
		}
	})
)

export default enhance;
