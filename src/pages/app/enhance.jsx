import React from 'react'
import { compose, withHandlers, lifecycle, withStateHandlers } from 'recompose'
import _ from 'lodash'
import { NotificationManager } from 'react-notifications'
import { menu_creator, saveUserSettings, menu_creator_header } from 'src/libs/methods'
import { apishka } from 'src/libs/api'
import { api } from 'src/defaults'

let chatSocket


const enhance = compose(
	withStateHandlers((
		inState = {
			custom_menu: [], user_detail: {}, collapsed: false, current_role: null
		}) => ({
			custom_menu: inState.custom_menu, user_detail: inState.user_detail,
			collapsed: inState.collapsed, current_role: inState.current_role
		}),
		{
		  set_state: (state) => (obj) => {
			let _state = {...state},
				keys = _.keys(obj)
			
			keys.map( k => _state[k] = obj[k])
			return _state
		  }
		}
	),

	withHandlers({
		getMenu: ({ set_state }) => () => {
			apishka( 'GET', {}, '/api/menus', (res) => {
				set_state({ 
					custom_menu: res.outjson.menus,
					user_detail: res.outjson.userdetail,
					current_role: res.outjson.current_role
				})
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
		menu_creator_header: menu_creator_header,
		menuCollapseStateSave: ({set_state}) => (collapseState) => {
			let userSettings = JSON.parse(localStorage.getItem('usersettings')) || {views:{}}
			userSettings['menuCollapse'] = collapseState
			saveUserSettings(userSettings)
			localStorage.setItem('usersettings',JSON.stringify(userSettings))
			set_state({ collapsed: collapseState })
		}
	}),
	withHandlers({
		handleGlobalWS: ({ getMenu}) => () => {
			let ws = document.location.href.split('//')[1]
			let ws_protocol = document.location.href.split('//')[0].indexOf('s') !== -1? 'wss' : 'ws'
			console.log('ws_protocol', ws_protocol)
			ws = ws.split('/')[0]
			  
			ws = ws_protocol + '://' + ws + '/global_ws'
			let globalSocket = new WebSocket(ws)
			globalSocket.onopen = () => {
				globalSocket.send(JSON.stringify({}))
			}
			globalSocket.onmessage = (e) => {
				let globalData = JSON.parse(e.data)
				globalData.forEach((g_item) => {
					NotificationManager.success('message', g_item.message)
					apishka('GET',  {id: g_item.id},  '/api/notifications_setreaded_by_userid')
				})
				getMenu()
			}
		},
	}),
    lifecycle({
		componentDidMount(){
			const { set_state, handleGlobalWS, getMenu} = this.props
			let userSettings = JSON.parse(localStorage.getItem('usersettings'))
			if (userSettings && userSettings.menuCollapse !== undefined) {
				set_state({ collapsed: userSettings.menuCollapse })
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

			getMenu()
			// handleChatWS()
			handleGlobalWS()
		},
		UNSAFE_componentWillMount() {
			let body = document.getElementsByTagName('body')[0]
			body.classList.remove('login_bckg')
		},
		componentDidUpdate(prevProps){
			const { chatId, set_first_id, location, handleChatWS, set_chat_id, handleGlobalWS } = this.props

			if(prevProps.chatId !== chatId) {
				chatSocket.close()
				handleChatWS()
			}
		}
	})
)

export default enhance
