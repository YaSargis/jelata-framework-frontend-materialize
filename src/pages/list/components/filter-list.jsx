import React from 'react'
import {compose, withHandlers, withState} from 'recompose'
import { apishka } from 'src/libs/api'
import _ from 'lodash'
import moment from 'moment'
import {saveUserSettings} from 'src/libs/methods'
import Select from 'react-select'
import { Row, Col, Button, Icon, Modal, Checkbox, Switch } from 'react-materialize'


let filterOK = (((LaNg || {}).filterOK ||{})[LnG || 'EN'] || 'ok')
let filterClean = (((LaNg || {}).filterClean ||{})[LnG || 'EN'] || 'clean')
let bClose = (((LaNg || {}).bClose ||{})[LnG || 'EN'] || 'close')
let shCols = (((LaNg || {}).shCols ||{})[LnG || 'EN'] || 'show/hide columns')

const FilterList = ({
	filter, filters, allProps, getData, changeLoading,
	changeFilter, changeFilters, handlerFilters, handlerGetTable,
	handlerTriCheck, handlerColumnHider, apiData,
	indeterminate, listColumns, arr_hide, reduxUser, pagination, changePagination
}) => {
	return (
		<Modal
			open={filter} 
			bottomSheet
			fixedFooter={false}
			onClose={() => changeFilter(!filter)}
		>
			<Row key='sawaddddfdf1' >
				{allProps.filters ? (
						Array.isArray(allProps.filters) &&
						allProps.filters.filter((f) => f.position === 1).length > 0
					) ?
						allProps.filters.filter((f) => f.position === 1).map((p, ixs)=> {
							return (
								<Col key={ixs + 's' + p.id} s={ parseInt(p.width) || 12}>
									{(() => {
										switch (p.type) {
											case 'substr':
												return [
													<Col key={'sxff3' + p.id} s={12}><label >{p.title}</label></Col>,
													<Col key={'sdffdd3' + p.id} s={12}>
														<input placeholder={p.title || '...'}
															value={filters[p.column]}
															style={{border: '1px solid #9e9e9e', height: '2.5rem', paddingLeft: '8px'}}
															onKeyUp={(event) => {
																if(event.keyCode === 13) {
																	getData(getData)
																	changeLoading(true)
																	changeFilter(false)
																}
															}}
															onChange={(event) => handlerFilters(p.column, event.target.value) }
														/>
													</Col>
												]
											break
											case 'date_between':
												return [
													<Col  key={'sdffvdd3' + p.id} s={12}><label >{p.title}</label></Col>,
													<Col  key={'sdvvffdd3' + p.id} s={12}>
														<input placeholder={p.title || '...'}
															value={filters[p.column]} type='date'
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
												//filters[p.column] &&
												  //Array.isArray(filters[p.column]) ?
													s_value = filters[p.column]//.map((x, i_c)=> {x['key'] = i_c})
													|| []
												} else s_value = filters[p.column]
												return [
													<Col key={'sdvffdd3d' + p.id} s={12}><label >{p.title}</label></Col>,
													<Col  key={'sdffdfdfdfdd3' + p.id} s={12}>
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
																filters[p.column] : (apiData[p.title] || []).filter((f) => f.value === filters[p.column])[0]
															
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
												/*
{
																apiData[p.title] ? Array.isArray(apiData[p.title]) ? (()=> {
																	return apiData[p.title].map((it_m, i_arr) => {
																		return <option key={i_arr} item={it_m} value={it_m.value}>{ it_m.label }</option>
																	})
																})() : null : null
															}
														</Select>
												
												*/
												break
											case 'typehead':
												return [
													<Col  key={'sdffddfff3' + p.id} s={12}><label >{p.title}</label></Col>,
													<Col  key={'sdvfvfffdd3' + p.id} s={12}>
														<input
															placeholder={p.title || '...'}
															value={filters[p.title]}
															style={{border: '1px solid #9e9e9e', height: '2.5rem', paddingLeft: '8px'}}
															onKeyUp={(event) => {
																if(event.keyCode === 13) {
																	getData(getData)
																	changeLoading(true)
																	changeFilter(false)
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
													<Col key={'sdvfvvvcccfffdd3' + p.id} s={12}><label >{p.title}</label></Col>,
													<Col key={'sdvfvfffdfdfdfdfdfd3' + p.id} >
														<Row>
															{/*
																value = [start date, end date]
																<DatePicker.RangePicker
																	value={_dates} format={_format}
																	onKeyUp={(event) => {
																		if(event.keyCode === 13) {
																			getData(getData) changeLoading(true)
																			changeFilter(false)
																		}
																	}}
																	locale={locale}
																	onChange={(momentDates, dates) => {
																		 let v = {
																			date1: dates[0], date2: dates[1],
																		}
																		handlerFilters(p.column, v)
																	}}
																/>
															*/}
															<Col key={'sdssfdd3' + p.id} s={6}>
																<input 
																	type='date'
																	onChange={(e) => {
																		let v = filters[p.column] || {}
																		v['date1'] = e.target.value
																		handlerFilters(p.column, v)
																	}}
																	onKeyUp={(event) => {
																		if(event.keyCode === 13) {
																			getData(getData) 
																			changeLoading(true)
																			changeFilter(false)
																		}
																	}}
																	
																	value={(filters[p.column] || {}).date1} 
																	style={{border: '1px solid #9e9e9e', height: '2.5rem', paddingLeft: '8px'}}
																/>
															</Col>
															<Col key={'sdvfvfffdddffd3' + p.id} s={6}>
																<input 
																	type='date'
																	onChange={(e) => {
																		let v = filters[p.column] || {}
																		v['date2'] = e.target.value
																		handlerFilters(p.column, v)
																	}}
																	onKeyUp={(event) => {
																		if(event.keyCode === 13) {
																			getData(getData) 
																			changeLoading(true)
																			changeFilter(false)
																		}
																	}}
																	
																	value={(filters[p.column] || {}).date2} 
																	style={{border: '1px solid #9e9e9e', height: '2.5rem', paddingLeft: '8px'}}
																/>
															</Col>	
														</Row>
													</Col>
												]
												break
											case 'check':
												return [
													<Col key={'sdvfvfffddccs3' + p.id} s={12}>
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
								</Col>
							)
						}) : null : null
				}
			</Row>

			<Row key='sawadddddww3' gutter={4}>
				<Button 
					flat
					small
					icon={<Icon>check</Icon>} 
					onClick={()=>{
						pagination.pagenum = 1
						changePagination(pagination)
						getData(getData) 
						changeLoading(true)
					}}
				>{filterOK}</Button>
				<Button 
					flat small
					icon={<Icon>delete</Icon>} 
					onClick={()=>{
						filters = {}
						changeFilters(filters) 
						changeLoading(true)
						// changeFilter(false)
						pagination.pagenum = 1
						changePagination(pagination)
						getData(getData, {})
				}}>{filterClean}</Button>
				<Button flat small icon={<Icon>close</Icon>} style={{ color: '#ef1010' }} onClick={()=>changeFilter(false)}>{bClose}</Button>
			</Row>
			<Row key='sawad5'>
				<br/>
				<div>{shCols}</div>
				<ul>
					{listColumns.map(rrrow => (
						<li key={'li_' + rrrow.title}>
							<Col key={'col' + rrrow.title} s={12}>
								<Checkbox 
									type='checkbox'
									key={'rrrow_' + rrrow.title}
									id={'rrrow_' + rrrow.title}
									label={rrrow.title}
									offLabel='Off'
									checked={_.findIndex(arr_hide, x => x === rrrow.title) === -1}
									onChange={(ev) => {  handlerColumnHider(ev, rrrow)}} />
							</Col>

						</li>
						))
					}
				</ul>
			</Row>
		</Modal>
	)
}

const enhance = compose(
	withState('indeterminate', 'changeInder', true),
	withState('apiData', 'changeApiData', {}),
	withHandlers({
		handlerColumnHider: ({ basicConfig, changeTS,  path }) => (ev, item) => {
			let userSettings = JSON.parse(localStorage.getItem('usersettings')) || {}
			let viewsSettings = {}

			if (!userSettings['views']) { // if not views key
				userSettings['views'] = {}
			}

			if (userSettings['views'][path]) { // if not view in views object
				viewsSettings = userSettings['views'][path]
			}

			if (viewsSettings.hide) {
				let ind = _.findIndex(viewsSettings.hide, (x, i) => x === item.title)
				if(ind !== -1) viewsSettings.hide.splice(ind, 1) 
				else viewsSettings.hide.push(item.title)
			} else {
				viewsSettings.hide = [item.title]
			}
			localStorage.setItem('usersettings', JSON.stringify(userSettings))
			userSettings['views'][path] = viewsSettings
			//reduxUser.user_detail.usersettings = userSettings
			saveUserSettings(userSettings)
			changeTS(userSettings['views'])
		},
		handlerFilters: ({filters, changeFilters}) => (column, value) => {
			filters[column] = value
			changeFilters(filters)
		},
		handlerTriCheck: ({ filters, changeFilters, changeInder }) => (column, value) => {
			if(value==null) {
				changeInder(false)
				filters[column] = true
				changeFilters(filters)
			}
			if(value === true) {
				filters[column] = false
				changeFilters(filters)
			}
			if(value === false) {
				changeInder(true)
				filters[column] = null
				changeFilters(filters)
			}
		},
		handlerGetTable: ({ listConfig, filters, apiData, changeApiData }) => (item) => {
			apishka('GET', {}, '/api/gettable?id=' + item.id, (res) => {
				apiData[item.title] = res.outjson
				changeApiData(apiData)
			})
		},
	})
)

export default enhance(FilterList)
