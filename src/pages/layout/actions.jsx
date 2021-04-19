import React  from 'react'
import qs from 'query-string'

import axios from 'axios'

import { compose, lifecycle, withHandlers } from 'recompose'
import { NotificationManager } from 'react-notifications'
import { Icon } from 'antd'

import {Button} from 'react-materialize'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

import { visibleCondition, switchIcon, QueryBuilder, QueryBuilder2, bodyBuilder } from 'src/libs/methods'
import { PostMessage, Delete, Get, Put, apishka } from 'src/libs/api'

import Getone from 'src/pages/Getone'
import List from 'src/pages/list'


let Error = (((LaNg || {}).Error ||{})[LnG || 'EN'] || 'Error')
let signError = (((LaNg || {}).signError ||{})[LnG || 'EN'] || 'sign error')
let Message = (((LaNg || {}).Message ||{})[LnG || 'EN'] || 'Message')
const ActionsBlock = ({
	actions, data, params,
	loading, type = 'form', checked,
	onSave, goBack, goLink,goLinkTo, onDelete,
	onCallApi, popup, calendar, onModal//, toggleLoading
}) => {
	if(calendar) type = 'table'
	let _actions = _.filter(actions, x => {
		x.isforevery = x.isforevery || false
		x.isforevery = _.isNumber(x.isforevery) ? x.isforevery === 1 ? true : false : x.isforevery
		if (x.isforevery === (type === 'table') && visibleCondition(data, x.act_visible_condition, params.inputs)) return x
	})
	return _actions.filter((act)=>act.type !== 'onLoad' &&  act.type !== 'Expand').map( (el, i) => {
		let _value = (type !== 'table') ? <span>{el.title}</span> : null,
			_val = el.title,
			place_tooltip = (type !== 'table') ? 'topLeft' : 'left'

		const onAction = (el) => {
			switch (el.type) {
				case 'Link':
					goLink(el)
					break
				case 'LinkTo':
					goLinkTo(el)
					break
				case 'Back':
					goBack(el)
					break
				case 'API':
					onCallApi(el)
					break
				case 'Save':
					onSave(el)
					break
				case 'Save&Redirect':
				  onSave(()=>goLink(el))
					 //goLink(el)
			  break
				case 'Delete':
				  onDelete(el)
					break
				case 'Modal':
				  onModal(el)
					break
				case undefined:
					goLink(el)
					break
		}}

		const FmButton = (props) => {
			let el = props.el
			return (
				<button
					className={  el.classname + ' m-btn' }
					size='small' href='#modal1'
					title={el.title} tooltip = 'ok'
					style={{marginLeft:4}}
					onClick={()=>{
						if (!(el.actapiconfirm === true || el.type === 'Delete'))
							onAction(el)
						else
							if (confirm(el.title + '?'))
								onAction(el)
					}}
				>
					<Icon type={el.icon} />
					{ _value }
				</button> 

			
				
			)
		}

		return (
			<FmButton confirmed={false} el = {el} />
		)
  })
}

const enhance = compose(

	withHandlers({
		SIGN_API: ({ getData, origin = {}, data, location, setLoading, checked}) => (config_one) => {
			let el = data, itm = config_one, config = origin.config, 
				inputs = location ? qs.parse(location.search) : null, 
				body = {}, args = {}

			let id_key = origin.config.filter((item) => item.col.toUpperCase() === 'ID' && !item.fn && !item.related )[0].key

			const paramBuild = new Promise((resolve, reject) => {
				let thumbprint = localStorage.getItem('thumbprint')
				if (config_one.parametrs && !_.isEmpty(config_one.parametrs)) {
					config_one.parametrs.forEach((obj) => {
						if (obj.paramcolumn) {
							if  (  data && data[0]) { 
								body[obj.paramtitle] = data[0][(config.filter((x)=> (
									x.col === obj.paramcolumn.label || x.title === obj.paramcolumn.value
								))[0] || {}).key]
							}
							if (!body[obj.paramtitle] && data) { 
								body[obj.paramtitle] = data[(config.filter((x)=> (
									x.col === obj.paramcolumn.label || x.title === obj.paramcolumn.value
								))[0] || {}).key]
							}
							if  ( !body[obj.paramtitle]) { 
								body[obj.paramtitle] = inputs[obj.paramcolumn.value]
							}	
						}
						else if (obj.paraminput) {
							body[obj.paramtitle] = inputs[obj.paraminput]
						} else {
							let cConst = obj.paramconst
							if (cConst === '_checked_')
								cConst = JSON.stringify(checked || [])
							body[obj.paramtitle] = cConst
						}


					}) 
					if (config_one.parametrs.filter((obj) => obj.paramt && (obj.paramt === 'sign' || obj.paramt === 'encode_and_sign')).length > 0) {
						config_one.parametrs.filter((obj) => obj.paramt && (obj.paramt === 'sign' || obj.paramt === 'encode_and_sign')).forEach((obj) => {
							let P = body[obj.paramtitle] 
							if (obj.paramt === 'encode_and_sign') 
								P = window.btoa(P)
							mdlp.signRequest(P, thumbprint).then((signature) => {
								console.log('sig:',signature)
								body[obj.paramtitle] = signature
								resolve(body)
							}).catch((err) => {
								NotificationManager.error(Error, signError + err, 5000)
								reject(err)
							})
						})	
						
					} else resolve(body)
				}
				else
					resolve(body)
			})


			paramBuild.then((body) => {
				setLoading(true)		
				apishka(
					config_one.actapitype, body, config_one.act,
					(res) => {
						setLoading(false)
						if (res && res.message) {
							NotificationManager.success(Message, res.message, 1000);

						}
						if (res && res._redirect) {
							window.location.href = res._redirect
						}
						if (!config_one.isforevery) {
							getData(data[id_key], getData)
						} else {
							getData(getData, {})
						}
					},
					(err) => {
						setLoading(false)
					}
				)

			}).catch((err)=> {
				setLoading(false)
				console.log('promise parambuild err: ', err)
			})
		}
	}),
	withHandlers({
		goLink: ({ data, origin, location, history, checked }) => (el) => {
			let url = ''
			if(!el.isforevery) {
				url = QueryBuilder2(data, el, origin.config, location ? qs.parse(location.search) : {}, checked)
			} else {
				url = QueryBuilder(data, el, origin.config,  location ? qs.parse(location.search) : {}, checked)
			}
			history.push(el.act + url)
		},
		goLinkTo: ({ data, origin, location, history,checked }) => (el) => {
			let url = ''
			if(!el.isforevery) {
				url = QueryBuilder2(data, el, origin.config, location ? qs.parse(location.search) : {}, checked)
			} else {
				url = QueryBuilder(data, el, origin.config, location ? qs.parse(location.search) : {}, checked)
			}
			window.open(el.act + url)
		},
		onCallApi: ({
			getData, origin = {}, data, location,
			params, checked, setLoading, SIGN_API
		}) => (config_one) => {
			setLoading(true) 
			/*let uri = config_one.act
			/function call() {
				let body = {}
				if (config_one.actapitype === 'GET') {
					uri = uri + QueryBuilder(data, config_one, origin.config, location ? qs.parse(location.search) : null, checked)
				} else {
					body = bodyBuilder(config_one, params.inputs, origin.config, data, checked)
				}
				let id_key = origin.config.filter((item) => item.col.toUpperCase() === 'ID' && !item.fn && !item.related )[0].key
				apishka(
					config_one.actapitype, body, uri,
					(res) => {
						if (res && res.message) {
							notification['success']({
								message: res.message
							})
						}
						if (res && res._redirect) {
							window.location.href = res._redirect
						}
						if (!config_one.isforevery) {
							getData(data[id_key], getData)
						} else {
							getData(getData, {})
						}
					},
					(err) => {
						setLoading(false)
					}
				)
			}*/
	
			SIGN_API(config_one)
			setLoading(false)

		},
		onDelete: ({ getData, data, origin, setLoading }) => () => {
			setLoading(true)
			let id_title = _.filter(origin.config, o => o.col.toUpperCase() === 'ID' && !o.fn && !o.relatecolumn)[0].key
			apishka(
				'DELETE', {
					tablename: origin.table,
					id: data[id_title],
					viewid: origin.viewid ||origin.id
				}, '/api/deleterow',
				(res) => {
					getData(getData)
				},
				(err) => {
					setLoading(false)
				}
			)
		},
		onModal: ({getData, origin, data, location, history}) => (act) => {
			const typeContent = act.act.split('/')[1]
			let inputs = QueryBuilder(data, act, origin.config, history)
			
			if(!act.isforevery)
				inputs = QueryBuilder2(data, act, origin.config, location ? qs.parse(location.search) : {})

			let search = { search: inputs, pathname: act.act }
			const ModalContent =  (typeContent, search, act) => {
				switch (typeContent) {
					case 'list':
						return (
							<div>
								<List
									compo={true} location={search} history = {history}
									path={act.act.split('/')[2]} id_page={act.act.split('/')[2]}
								/>
							</div>
						)
					case 'tiles':
						return (
							<div>
								<List
									compo={true} location={search} history = {history}
									path={act.act.split('/')[2]} id_page={act.act.split('/')[2]}
								/>
							</div>
						)
					case 'getone':
						return (
							<div>
								<Getone
									compo={true} location={search} history = {history}
									path={act.act.split('/')[2]} id_page={act.act.split('/')[2]}
								/>
							</div>
						)
					default:
						/*const openNotification = () => {
							notification.open({
								message: `type ${typeContent} not correct  `,
								description: 'use list or getone'
							})
						}*/
					return null
				}
			}
			
			let _value = !act.isforevery? act.title : ''
			let id_key = origin.config.filter((item) => item.col.toUpperCase() === 'ID' && !item.fn && !item.related )[0].key

			confirmAlert({
				title: <h4>{act.title}</h4>,
				childrenElement: () => (
					<div>
						{ModalContent(typeContent, search, act)}
					</div>
				),
				buttons: [{ 
					label:  <Icon type='close' />,
					onClick: () => {
						if (!act.isforevery) {
							getData(data[id_key], getData)
						} else {
							getData(getData, {})
						}
					}
				}]
			})
		},
		goBack: ({ history }) => () => {
			history.goBack()
		}
	}),
)

export default enhance(ActionsBlock)
