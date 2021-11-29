import React from 'react'
import {compose, withHandlers, withStateHandlers} from 'recompose'
import { apishka } from 'src/libs/api'
import _ from 'lodash'


import { Row, Col, Button, Icon, Modal, Checkbox, Switch, Card, Collapsible, CollapsibleItem } from 'react-materialize'
import Filters from './filters'
import { saveUserSettings } from 'src/libs/methods'
let bClose = (((LaNg || {}).bClose ||{})[LnG || 'EN'] || 'close')
let shCols = (((LaNg || {}).shCols ||{})[LnG || 'EN'] || 'show/hide columns')


const FilterList = ({
	filter, filters, allProps, getData, changeLoading,
	changeFilter, changeFilters, handlerColumnHider, apiData, changeTS, basicConfig,
	indeterminate, listColumns, arr_hide, pagination, changePagination, params,
	styleType // up, left 
}) => {
	if (styleType === 'up')
		return (
			<Collapsible key = 'filt-up' accordion={false} >
				<CollapsibleItem header={<Icon>settings_input_component</Icon>} key='sr411' 
					expanded={(filters && Object.keys(filters).length > 0)?true: false}>
					<Filters 
						filter={filter} filters={filters} allProps={allProps}
						getData={getData} changeLoading={changeLoading}
						changeFilter={changeFilter}
						apiData={apiData} indeterminate={indeterminate} changeFilters = {changeFilters}
						pagination={pagination} changePagination={changePagination} styleType={styleType} 
						params={params}
					/>
				</CollapsibleItem>	
			</Collapsible>
		)
	else 
		return (
			<Modal
				open={filter} 
				bottomSheet
				fixedFooter={false}
				onClose={() => changeFilter(!filter)}
			>
				<Row key='sawaddddfdf1' >
					<Filters 
						filter={filter} filters={filters} allProps={allProps}
						getData={getData} changeLoading={changeLoading}
						changeFilter={changeFilter} 
						apiData={apiData} indeterminate={indeterminate} changeFilters = {changeFilters}
						pagination={pagination} changePagination={changePagination} styleType={styleType}  
						params={params}
							
					/>
				</Row>

				<Row key='sawadddddww3' gutter={4}>
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
	withStateHandlers(({
		inState = {

		}
	}) => ({

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
		}
	})
)

export default enhance(FilterList)