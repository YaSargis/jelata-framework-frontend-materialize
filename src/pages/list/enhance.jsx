import React from 'react'
import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import _ from 'lodash'
import qs from 'query-string'
import { NotificationManager } from 'react-notifications'
import { saveUserSettings } from 'src/libs/methods'
import { apishka } from "src/libs/api"

let wss = [] // ws array
let Message = (((LaNg || {}).Message ||{})[LnG || 'EN'] || 'Message')
let Error = (((LaNg || {}).Error ||{})[LnG || 'EN'] || 'Error')
let unknownError = (((LaNg || {}).unknownError ||{})[LnG || 'EN'] || 'Unknown error')
let wsError = (((LaNg || {}).wsError ||{})[LnG || 'EN'] || 'ws error')
const enhance = compose(
	withStateHandlers(({
		inState = {
			filter: false, expandState: [], collapseAll: true,
			localChangeCollapse: false, localActiveKey: [],
			loading: false, listData: [], listColumns: [],
			listConfig: [], listActions: [], pagination: {
				pagenum: 1, pagesize: 20, foundcount: 0
			}, isorderby: false, allProps: [], checked: [],
			ready: false, filters: {}, params: {
				inputs: {}
			},
			settings_views: JSON.parse( localStorage.getItem('usersettings')) || {'views':{}}
		}}) => ({
			filter: inState.filter,  expandState: inState.expandState,
			collapseAll: inState.collapseAll, localChangeCollapse: inState.localChangeCollapse,
			localActiveKey: inState.localActiveKey, loading: inState.loading, listData: inState.listData,
			listColumns: inState.listColumns, listConfig: inState.listConfig,
			listActions: inState.listActions, pagination: inState.pagination,
			allProps: inState.allProps, checked: inState.checked, ready: inState.ready,
			filters: inState.filters, params: inState.params, settings_views: inState.settings_views
		}), {
			set_state: (state) => (obj) => { 
				let _state = {...state}, keys = _.keys(obj) 
					keys.map( k => { _state[k] = obj[k] }) 
					return _state 
			},
			changeFilter: (state) => (obj) => ({
				...state, filter: obj
			}),
			changeLoading: (state) => (bool) => ({
				...state, loading: bool
			}),
			changePagination: (state) => (obj) => ({
				...state, pagination: obj
			}),
			changeChecked: (state) => (obj) => ({
				...state, checked: obj
			}),
			changeFilters: (state) => (obj) => ({
				...state, filters: obj
			}),
			changeParams: (state) => (obj) => ({
				...state, params: obj
			})
		},
	),
	withHandlers({
    //actsRender: ActsRender,
		get_params: (props) => (_props) => {
			let params = {},
			_p = _props || props // _props = nextProps or prevProps
			if(props.compo) {
				params.inputs  = qs.parse(_p.location.search) 
				params.search  = _p.location.search
				params.path = _p.path 
				params.id_page = _p.path
			} else {
				params.inputs  = qs.parse(_p.location.search) 
				params.search  = _p.location.search
				params.path    = _p.match 
				params.id_page = _p.match.params.id_page // id_page приходит из React-router
			}
			return {...params}
		}}),
	withHandlers({
		getData: ({
			pagination, print, filters, location, history, basicConfig, changeBasicConfig,
			get_params, set_state, changeListConfig,
			/*composition, set_comp,*/ changeLoading, params,
			changeListData, changeListColumns, changePagination, compo, path,
			match, changeReadyTable, changeReady, changeAllProps, changeListActions,
			changeIsOrderBy, expand,  changeTS
		}) => (getData, _filters) => {

			changeLoading(true)
			let _basicConfig = {...basicConfig}
			let settings_table = ((JSON.parse(localStorage.getItem('usersettings')) || {'views':{}})['views']|| {})[location.pathname] || {}

			if (settings_table && settings_table.pagesize) {
				pagination.pagesize = settings_table.pagesize
			}

			const go = () => new Promise((resolve, reject) => {
				let _id = compo ? path : match.params.id
				apishka('POST', {
					pagination: pagination, print: print,
					filters: _filters || filters, inputs: params.inputs
				}, '/schema/list?path=' + _id, (res) => {
					res = {data:res}
			  		if (!compo && !params.inputs._doctitle_)
						document.title = res.data.title
			  		else if (params.inputs._doctitle_)
			  			document.title = params.inputs._doctitle_

			        pagination.foundcount = res.data.foundcount

		  			if (res.data.subscrible ) {
				  		let ws = document.location.href.split('//')[1]
						let ws_protocol = document.location.href.split('//')[0].indexOf('s') !== -1? 'wss' : 'ws'

				  		ws = ws.split('/')[0]
				  		ws = ws_protocol + '://' + ws + '/ws'
				  		let socket = new WebSocket(ws)
				  		wss.push(socket)
				  		socket.onopen = () => {
							let idcol = (res.data.config.filter((x) => x.col.toUpperCase() === 'ID' && !x.related)[0] || {}).key
							let ids = []
							res.data.data.forEach((x) =>  ids.push(x[idcol]))
							socket.send(JSON.stringify({'viewpath':_id, 'ids':ids}))
						}

						socket.onclose = (event) => {
				  			if (event.wasClean) {
				  				console.log('clear closed (list)')
				  			}
				  			else {
				  				console.log('ws message close failed')
				  			}
			  			}

				  		socket.onmessage = (e) => {
				  			let data = JSON.parse(e.data)
							if (!data.error) {
								data.forEach((x) => {
									NotificationManager.success(Message, x.notificationtext, 1000)
									apishka('POST', {id:x.id}, '/api/setsended')
			  						getData(getData)
			  					})
			  				}	else {
			  					console.log('ws message send error')
			  				}
			  			}

				  		socket.onerror = (error) => {
				  			console.log('ws message send error')
				  		}
  				    }

					if(Array.isArray(res.data.config)) {
						let columns = []
						res.data.config.forEach((_el,i) => {
							let el = {..._el}
							let col = {
								title: el.title,
								onHeaderCell: (column) => {
									return {
										onClick: () => {
											if(column.sortOrder === false) {
												column.sortOrder = 'ascend'
												changeReady(true)
											}
										}
									}
								},
								dataIndex: el.key, sorter:el.sorter, sortOrder:el.sortOrder,
								width: el.width ? 100 : el.width
							}
							i === 0 ? col.key = 'key' : null
							el.visible ? columns.push(col) : null
						})

						set_state({ listColumns: columns })
					}

					let arr = res.data.data.map((ex)=> {
						ex.key = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15 >> c/4).toString(16))
						return ex
					})
					set_state({
						origin: {...res.data},
					})

			  		if (res.data.acts.filter((a) => a.isforevery && a.type !== 'Expand' && a.type !== 'onLoad').length > 0 ) {
			  			res.data.config.push({col:'__actions__', title:'➥', key: '__actions__', visible:true, editable:false })
			  		}
			  		if (res.data.pagination)
			  			res.data.config.unshift({col:'rownum', title:'#', key: 'rownum', visible:true, editable:false })
			  		if (res.data.checker)
			  			res.data.config.unshift({col:'checker', title:'', key: '__checker__', visible:true, editable:false })
					set_state({
						origin: {...res.data},
						allProps: res.data,  // array
						listData: arr,
						listConfig: res.data.config,
						listActions: res.data.acts,
						isorderby: res.data.isorderby
					})
					changePagination(pagination)
					changeLoading(false)
					resolve()
				},(err) => {})
			})

			go().then(()=> {
				set_state({ ready: true })
			})
		}
	}),
	withHandlers({
		handlerPaginationPage: ({ getData, pagination, changePagination, location }) => (page, pageSize) => {
			pagination.pagenum = page
			pagination.pagesize = pageSize

			let userSettings = JSON.parse(localStorage.getItem('usersettings')) || {views:{}}
			if (userSettings.views && userSettings.views[location.pathname]) {
				userSettings.views[location.pathname].pagesize = pageSize
			} else if (userSettings.views && !userSettings.views[location.pathname]) {
				userSettings.views[location.pathname] = {pagesize:pageSize}
			}
			saveUserSettings(userSettings)
			localStorage.setItem('usersettings',JSON.stringify(userSettings))

			changePagination(pagination)
			getData(getData)
		},

		handleTableChange: ({changeReady, getData, params, changeParams, allProps}) => (pagination, filters, sorter) => {
			/* server sorter */
			changeReady(false)
			let config = allProps.config
			let colObj = config.filter((x) => x.title === sorter.field)[0]
			let {inputs} = params
			let orderby = []

			if (sorter.order) {
				if (sorter.order === 'descend')
					orderby.push({"col":colObj.col,"t":colObj.t,"related":colObj.related || 0, "desc":"desc", "over":true, "fn":colObj.fn, "fncols":colObj.fncolumns})
				else
					orderby.push({"col":colObj.col,"t":colObj.t,"related":colObj.related || 0, "desc":"", "fn":colObj.fn, "fncols":colObj.fncolumns})
			}

			inputs["orderby"] = orderby
			changeParams({...params}) 
			getData(getData)
		}
	}),
	withHandlers({
		onSaveRow: ({ getData, onChangeData, set_state, listData, origin, global = {}, history, compo }) => (value, item_config, dataRowIndex) => {
			let id_title = _.filter(origin.config, o => o.col.toUpperCase() === 'ID' && !o.fn && !o.relatecolumn)[0].key
			let data = listData[dataRowIndex]

			let _data = {}
			const go = () => new Promise((resolve, reject) => {
				_data.tablename = origin.table
				data[id_title] ? _data.id = data[id_title] : null
				_data.config = {...item_config}
				_data.value = value
				_data.viewid = origin.viewid
				if(!item_config.related) {
					_data.tablename = origin.table
				} else {
					_data.relatetable = _data.tablename
					_data.tablename = item_config.table
				}
				resolve(_data)
			})

			go().then( _data => {
				apishka(
					'POST', _data, '/api/saverow', (res) => {
						let res_data = res.outjson
						getData(getData)
						NotificationManager.success(Message, 'OK', 1000)
						if (item_config.updatable && compo) {
							let search_updater = '___hashhhh___=0.11'
							if (location.search.indexOf('?') === -1)
								search_updater = '?' + search_updater
							else
								search_updater = '&' + search_updater
							history.push(location.pathname + location.search + search_updater + location.hash)
						}
					}
				)
			}).catch((err) => {
				if(err) {
					console.log('Unknown error:',err)
					/*notification.error({
						message: 'Error',
						description: err.response ?  err.response.data.message : 'Unknown error'
					})*/
					NotificationManager.error(Error, err.response ?  err.response.data.message : unknownError, 1000)
				}
			})
		}
	}),
	withHandlers({
		onChangeInput: ({ onSaveRow }) => (event, item, dataRowIndex) => {
			let value = (event && event.target) ? event.target.value : event
			onSaveRow(value, item, dataRowIndex)
		},
		onChangeCollapse: ({set_state}) => (key) => {
			set_state({
				localChangeCollapse: true, localActiveKey: key
			})
		}
	}),
	lifecycle({
		componentWillMount() {
			const { pagination, location, params, match, search, path, compo, getData, changeParams, set_state, settings_views, changeFilters } = this.props
			let filters = {}
			if(compo) {
				params.path = path 
				params.inputs = qs.parse(location.search)
				params.search = search
				pagination.pagenum = 1
				filters = (((settings_views.views || {views:{}})[path] || {}).filters || {})
			} else {
				params.inputs = qs.parse(location.search)
				params.search = location.search
				params.path = match.url
				filters = ((settings_views.views || {views:{}})[match.url] || {}).filters || {}
			}

			let type = location.pathname.split('/')[1]
			set_state({
				type_list: type
			})

			changeParams({...params, ...pagination})
			changeFilters(filters)
			getData(getData, filters)
		},
		componentWillUnmount() {
			wss.forEach((ws_item) => ws_item.close()) // close all sockets
		},
		componentDidUpdate(prevProps) {
			const { btnCollapseAll, set_state } = this.props
			if(prevProps.btnCollapseAll !== btnCollapseAll) {
				set_state({
					localChangeCollapse: false, collapseAll: btnCollapseAll
				})
			}
		},
		componentWillUpdate(nextProps) {
			let {
				match, getData, changeListColumns, changeReady, set_state,
				filters, changeFilters, path, compo, params, changeParams, pagination
			} = this.props
			if (nextProps)
				if(compo) {
					if((params.path !== nextProps.params.path) || (this.props.location.search !== nextProps.location.search)) {
						params.inputs = qs.parse(nextProps.location.search)
						params.search = nextProps.location.search
						params.path = this.props.path
						pagination.pagenum = 1
						set_state({ ready: false, listColumns: {} })
						changeFilters({})  
						changeParams({...params, ...pagination})
						getData(getData, {})
					}
				} else {
					if(this.props.match.params.id !== nextProps.match.params.id) {
						set_state({ ready: false }) 
						pagination.pagenum = 1
						params.inputs = qs.parse(nextProps.location.search)
						changeFilters({}) 
						getData(getData, {})

						set_state({
							listColumns: {}
						})
					}
				}
		}
	})
)
export default enhance
