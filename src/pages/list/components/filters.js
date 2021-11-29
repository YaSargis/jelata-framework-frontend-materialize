import React from 'react'
import { Row, Col, Button, Icon, Modal, Checkbox, Switch, Card, Collapsible, CollapsibleItem } from 'react-materialize'
import Select from 'react-select'
import {compose, withHandlers, withStateHandlers} from 'recompose'
import locale from 'antd/es/date-picker/locale/ru_RU'
import moment from 'moment'
import { saveUserSettings } from 'src/libs/methods'
let filterOK = (((LaNg || {}).filterOK ||{})[LnG || 'EN'] || 'ok')
let filterClean = (((LaNg || {}).filterClean ||{})[LnG || 'EN'] || 'clean')
const Filters = ({
	filter, filters, allProps, getData, changeLoading,
	changeFilter, handlerFilters, handlerGetTable, onOK,
	handlerTriCheck, apiData, indeterminate, changeFilters,
	pagination, changePagination, styleType, path, params
	
}) => {
	
	let position = '1'
	if (styleType === 'up')
		position = '2'
	return (
		<div>
			{
				allProps.filters ? (
					Array.isArray(allProps.filters) &&
					allProps.filters.filter((x) => x.position == position).length > 0
				) ? allProps.filters.filter((x) => x.position == position).map((p, ixs)=> {
					return ( 
						<Row key={JSON.stringify(p)}>
							{(() => {
								switch (p.type) {
									case 'substr':
										return [
											<Col key={'sx3' + p.id} s={12}><label >{p.title}</label></Col>,
											<Col key={'sddd3' + p.id} s={12}>
												<input 
													placeholder={p.title || '...'}
													value={filters[p.column] || ''}
													style={{border: '1px solid #9e9e9e', height: '2.5rem', paddingLeft: '8px'}}
													onKeyUp={(event) => {
														if(event.keyCode === 13) {
															onOK()
														}
													}}
													onChange={(event) => handlerFilters(p.column, event.target.value) }
												/>
											</Col>
										]
									break
									case 'date_between':
										return [
											<Col key={'sx4' + p.id} s={12}><label >{p.title}</label></Col>,
											<Col key={'sx44' + p.id} s={12}>
												<input placeholder={p.title || '...'}
													value={filters[p.column] || ''} type='date'
													style={{border: '1px solid #9e9e9e', height: '2.5rem', paddingLeft: '8px'}}
													onChange={(event) => handlerFilters(p.column, event.target.value) }
												/>
											</Col>
										]
										break
									case 'multijson':
									case 'select':
									case 'multiselect':
										let s_value
										
										if(p.type === 'multijson' || p.type === 'multiselect'){
											//filters[p.column] && Array.isArray(filters[p.column]) ?
											s_value = filters[p.column]//.map((x, i_c)=> {x['key'] = i_c}) 
											|| []
										} else s_value = filters[p.column]
										
										return [
											<Col key={'s33' + p.id} s={12}><label >{p.title}</label></Col>,
											<Col key={'s443' + p.id} s={12}>
												<Select
													styles={{
														menuPortal: (base) => ({
															...base,
															zIndex: 9999
														}),
														dropdownIndicator: (base) => ({
															...base,
															padding: 2
														}),
														clearIndicator: (base) => ({
															...base,
															padding: 2
														}),
														control: (base) => ({
															...base,
															minHeight: 0
														}),
														input: (base) => ({
															...base,
															padding: 0
														}),
														valueContainer: (base) => ({
															...base,
															padding: '0 8px',
															color: '#000000'
														}),
														placeholder: (base)=>({
															...base,
															color: '#cdbfc7'
														})
													}}
																
													isMulti={ (p.type === 'multijson' || p.type === 'multiselect') ? true : false }
													showSearch={true}
													value={(p.type === 'multijson' || p.type === 'multiselect') ? 
															(filters[p.column] || []) : (
																(apiData[p.title] || []).filter((f) => f.value === filters[p.column])[0] || null
															)				
													}
													placeholder={p.title}
													style={{ width: '100%', border: '1px solid #9e9e9e' }}
													onFocus={()=>handlerGetTable(p)}
													options={apiData[p.title]}
													onDeselect={(_val) => {
														if(p.type === 'multijson' || p.type === 'multiselect') {
															filters[p.column] = s_value.filter(o => o && o.key !== _val.key)
															handlerFilters(p.column, filters[p.column])
														}
													}}
													onChange={(_val, option) => {
														if (p.type === 'multijson' || p.type === 'multiselect')
															handlerFilters(p.column, _val || [])
														else 
															handlerFilters(p.column, (_val || {}).value || null)
													}}
												/>
																	
											</Col>
										]
										break
									case 'typehead':
										return [
											<Col key={'sd3' + p.id} s={12}><label >{p.title}</label></Col>,
											<Col key={p.id + 'ssdf'} s={12}>
												<input
													placeholder={p.title || '...'}
													value={filters[p.title] || ''}
													style={{border: '1px solid #9e9e9e', height: '2.5rem', paddingLeft: '8px'}}
													onKeyUp={(event) => {
													if(event.keyCode === 13) {
														onOK()
														//changeLoading(true)
														//changeFilter(false)
													}
												}}
												onChange={(event) => handlerFilters(p.title, event.target.value) }
											/>
											</Col>
										]
										break
									case 'period':
										let _dates = [],
											_format = 'YYYY-MM-DD'
											filters[p.column] ? filters[p.column].date1 ? _dates.push(moment(filters[p.column].date1, _format)) : null : null
											filters[p.column] ? filters[p.column].date2 ? _dates.push(moment(filters[p.column].date2, _format)) : null : null
										return [
											<Col key={'d ' + p.id} s={12}><label >{p.title}</label></Col>,
											<Col key={p.column + p.id + 'dfs'} >
												<Row>
													<Col key={p.column + p.is + 'fgd'} s={6}>
														<input 
															type='date'
															onChange={(e) => {
																let v = filters[p.column] || {}
																v['date1'] = e.target.value
																handlerFilters(p.column, v)
															}}
															onKeyUp={(event) => {
																if(event.keyCode === 13) {
																	onOK()
																}
															}}
																			
															value={(filters[p.column] || {}).date1 || ''} 
															style={{border: '1px solid #9e9e9e', height: '2.5rem', paddingLeft: '8px'}}
													/>
													</Col>
														<Col key={p.column + p.id + 'fdsa'} s={6}>
															<input 
																type='date'
																onChange={(e) => {
																	let v = filters[p.column] || {}
																	v['date2'] = e.target.value
																	handlerFilters(p.column, v)
																}}
																onKeyUp={(event) => {
																	if(event.keyCode === 13) {
																		onOK()
																	}
																}}
																value={(filters[p.column] || {}).date2 || ''} 
																style={{border: '1px solid #9e9e9e', height: '2.5rem', paddingLeft: '8px'}}
															/>
														</Col>	
												</Row>
											</Col>
										]
										break
										case 'check':
											return [
												<Col key={p.column + p.id+';lkl'} s={12}>
													<Checkbox 
														key={p.column}
														id={p.column}
														indeterminate={(filters[p.column] === null || filters[p.column] === undefined)? true : false}
														checked={filters[p.column] || null}
														onChange={()=>{
															handlerTriCheck(p.column, filters[p.column])
														}}
														label={p.title}
													/>
												</Col>
											]
											break
										default:
											return <Col>{p.type}</Col>
								}})()
							}
						</Row>
					)
				}) : null : null
			}
				<Row key='sawadddddwwvcv3' gutter={4}>
					<Button 
						flat
						small
						icon={<Icon>check</Icon>} 
						onClick={onOK}
					>{filterOK}</Button>
					<Button 
						flat small
						icon={<Icon>delete</Icon>} 
						onClick={()=>{
							//changeLoading(true)
							let userSettings = JSON.parse(localStorage.getItem('usersettings')) || {views:{}}
							
							let viewsSettings = {}
							if (!userSettings['views']) { // if not views key
								userSettings['views'] = {}
							}

							if (userSettings['views'][params.path]) { // if not view in views object
								viewsSettings = userSettings['views'][params.path]
							}
							viewsSettings['filters'] = {}
							userSettings['views'][params.path] = viewsSettings
							localStorage.setItem('usersettings', JSON.stringify(userSettings))
							
							saveUserSettings(userSettings)
							changeFilters({}) 
							
							
							//changeFilter(false)
							pagination.pagenum = 1
							changePagination(pagination)
							getData(getData, {})
					}}>{filterClean}</Button>
				</Row>
		</div>
	)
}

const enhance = compose(
	withStateHandlers(({
		inState = {
			indeterminate: true,
			apiData: {}
		}
	}) => ({
		indeterminate: inState.indeterminate,
		apiData: inState.apiData
	}), {
		set_state: state => obj => {
			let _state = { ...state }
			_.keys(obj).map(k => {
				_state[k] = obj[k]
			});
			return _state
		}
	}),
	withHandlers({
		handlerFilters: ({ filters, changeFilters }) => (column, value) => {
			
			
			filters[column] = value
			changeFilters(filters)
		},
		handlerTriCheck: ({ filters, changeFilters, set_state }) => (column, value) => {
			if(value==null) {
				set_state({ indeterminate: false })
				filters[column] = true
				changeFilters(filters)
			}
			if(value === true) {
				filters[column] = false
				changeFilters(filters)
			}
			if(value === false) {
				set_state({ indeterminate: true })
				filters[column] = null
				changeFilters(filters)
			}
			
			
		},
		handlerGetTable: ({ apiData, set_state }) => (item) => {
			apishka('GET', {}, '/api/gettable?id=' + item.id, (res) => {
				 const _apiData = {...apiData}
				 _apiData[item.title] = res.outjson
				 set_state({ apiData: _apiData })
			})
		},
		onOK: ({getData, changePagination, changeLoading, params, filters, pagination }) => () => {
			let userSettings = JSON.parse(localStorage.getItem('usersettings')) || {views:{}}
			console.log('patttttttth', params.path)
			let viewsSettings = {}
			if (!userSettings['views']) { // if not views key
				userSettings['views'] = {}
			}
			if (userSettings['views'][params.path]) { // if not view in views object
				viewsSettings = userSettings['views'][params.path]
			}
			viewsSettings['filters'] = filters
			userSettings['views'][params.path] = viewsSettings
			localStorage.setItem('usersettings', JSON.stringify(userSettings))
			saveUserSettings(userSettings)
			
			pagination.pagenum = 1
			changePagination(pagination)
			getData(getData)
			changeLoading(true)
		}
	})
)

export default enhance(Filters)
