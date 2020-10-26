import React from 'react';
import {
  DatePicker, Input, Icon
} from 'antd';
import * as moment from 'moment';

import Select from 'src/pages/Getone/components/select';
import MultiSelect from 'src/pages/Getone/components/multiselect';
import Typeahead from 'src/pages/Getone/components/typehead';
import MultiTypehead from 'src/pages/Getone/components/multitypehead';
import { handlerGoLink, visibleCondition } from 'src/libs/methods';

export const listConfigGenerate = (
	listConfig, listData, listActions, arr_hide, params, history, isorderby,
	changeChecked, set_state, onChangeInput, getData
) => {
	const columns2 = []
	listConfig.forEach((item, ind) => {
		if (item.key == '__checker__') {
			columns2.push({
				dataField: item.key, text: item.title,
				title:  item.title, editable:false,
				headerFormatter: () => (
					<input
						onChange={(e)=>{
							let id_key = listConfig.filter((conf) => conf.col.toLowerCase() === 'id' && !conf.related)[0].key
							let chckd = [] // this is new checked array
							if (e.target.checked) {
								listData.forEach((col) => {
									chckd.push(col[id_key])
								});	
							}
							changeChecked(chckd)
						}}
						type='checkbox' />
				)
			})
		}

		if (item.visible && arr_hide.filter(hCol => hCol === item.title).length === 0 && item.key !== '__checker__') {
			const isEditableClass = (editable) => {
				if (editable) {
					return 'editable'
				} else {
					return ''
				}
			}
			let classname = item.classname + ' ' + isEditableClass(item.editable)
			columns2.push({
				dataField: item.key, text: item.title, title: () => item.title,
					events: {
						onDoubleClick: (e, column, columnIndex, row, rowIndex) => {
							let action = _.find(
							   listActions, x => x.ismain === true &&
							   visibleCondition(listData[rowIndex], x.act_visible_condition, params.inputs)
							);
							if (action) {
								switch (action.type) {
									case 'Link':
										handlerGoLink(listData[rowIndex], action, listConfig, params.inputs, history);
									break;
								}
							}
						}
					},
					headerTitle: true,
					editable: item.editable,
					style: {
						maxWidth: item.width, minWidth: item.width,
					},
					searchable: true,
					headerStyle: {
						width: item.width, maxWidth: item.width, minWidth: item.width,
					},
					classes: item.col === '__actions__'? 'tab_actions' : classname ,
					headerClasses: item.col === '__actions__'?
						'tab_actions ant-table-header-column ant-table-column-has-actions'
						: 'ant-table-header-column ant-table-column-has-actions',
					sort: isorderby,
					sortCaret: (order, column) => {
						if (!order)
							return (
								<span style={{ fontSize: 9 }}>
									<Icon type='caret-up' />
									<Icon type='caret-down' />
								</span>
							);
						else if (order === 'asc')
							return (
								<span style={{ fontSize: 9 }}>
									<Icon style={{ color: 'red' }} type='caret-up' />
									<Icon type='caret-down' />
								</span>
							);
						else if (order === 'desc')
							return (
								<span style={{ fontSize: 9 }}>
									<Icon type='caret-up' />
									<Icon style={{ color: 'red' }} type='caret-down' />
								</span>
							);
						return null;
					},
					onSort: (field, order) => {
						let inputs = params.inputs;
						let desc = '';
						if (order === 'desc') desc = order;
						let orderby = [{
							col: item.col, desc: desc,
							fn: item.fn, fncols: item.fncolumns,
							related: item.related, t: item.t
						}];
						inputs['orderby'] = orderby;
						params['inputs'] = inputs;
						set_state({ params: params }, getData(getData));
					},
					editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => {
						let colValItem = listData[rowIndex];
						let colVal = colValItem[column.dataField];

					switch (item.type) {
						case 'text':
						case 'number':
						case 'password':
							return (
								<Input
									type={item.type}
									value={colVal}
									onChange={e => {
										listData[rowIndex][column.dataField] = e.target.value;
										set_state({ listData: listData });
									}}
									onBlur={e => onChangeInput(e.target.value, item, rowIndex)}
								/>
							);
						  break;
						case 'checkbox':
							return (
								<Input
									type={item.type}
									checked={colVal}
									onChange={e => {
										listData[rowIndex][column.dataField] = e.target.checked;
										onChangeInput(e.target.checked, item, rowIndex);
										set_state({ listData: listData });
									}}
								/>
							);
							break;
						case 'date':
							return (
								<DatePicker
									value={colVal ? moment(colVal, 'DD.MM.YYYY') : null}
									onChange={(f, e) => {
										listData[rowIndex][column.dataField] = e; //.target.value
										onChangeInput(e, item, rowIndex);
										set_state({ listData: listData });
									}}
								  
									format='DD.MM.YYYY'
								/>
							);
							break;
						case 'datetime':
							return (
								<DatePicker
									value={colVal ? moment(colVal, 'DD.MM.YYYY HH:mm') : null}
									onChange={(f, ev) => {
										listData[rowIndex][column.dataField] = ev; //.target.value
										onChangeInput(ev, item, rowIndex);
										set_state({ listData: listData });
									}}
									format='DD.MM.YYYY HH:mm'
								/>
							);
						case 'select':
						case 'select_api':
							return (
								<Select
									name={
										([1e7]+-1e3+-4e3+-8e3+-1e11)
										.replace(/[018]/g,c=>(
										  c^crypto.getRandomValues(
											new Uint8Array(1))[0]&15 >> c/4
										).toString(16))
									}
									config={item}
									data={colValItem} inputs={params.inputs}
									onChangeInput={e => {
										listData[rowIndex][column.dataField] = e; //.target.value
										set_state({ listData: listData });
										onChangeInput(e, item, rowIndex);
									}}
									location={location} globalConfig={listConfig}
								/>
							);
							break;
						case 'multiselect':
						case 'multiselect_api':
							return (
								<MultiSelect
									name={
										([1e7]+-1e3+-4e3+-8e3+-1e11)
										.replace(/[018]/g,c=>(
										  c^crypto.getRandomValues(
											new Uint8Array(1))[0]&15 >> c/4
										  ).toString(16))
									}  config={item}
									data={colValItem} inputs={params.inputs}
									onChangeInput={e => {
										listData[rowIndex][column.dataField] = e; //.target.value
										onChangeInput(e, item, rowIndex);
										set_state({ listData: listData });
									}}
									location={location} globalConfig={listConfig}
								/>
							);
						case 'typehead':
						case 'typehead_api':
							return (
								<Typeahead
									name={
										([1e7]+-1e3+-4e3+-8e3+-1e11)
										.replace(/[018]/g,c=>(
										  c^crypto.getRandomValues(
											new Uint8Array(1))[0]&15 >> c/4
										 ).toString(16))
									}  
									config={item}
									data={colValItem} inputs={params.inputs}
									onChangeInput={e => {
										listData[rowIndex][column.dataField] = e; //.target.value
										onChangeInput(e, item, rowIndex);
										set_state({ listData: listData });
									}}
									location={location} globalConfig={listConfig}
								/>
							);
							break;
						case 'multitypehead':
						case 'multitypehead_api':
							return (
								<MultiTypehead
									name={
										([1e7]+-1e3+-4e3+-8e3+-1e11)
										.replace(/[018]/g,c=>(
										  c^crypto.getRandomValues(
											new Uint8Array(1))[0]&15 >> c/4
										).toString(16))
									}  
									config={item}
									data={colValItem} inputs={params.inputs}
									onChangeInput={e => {
										listData[rowIndex][column.dataField] = e; //.target.value
										onChangeInput(e, item, rowIndex);
										set_state({ listData: listData });
									}}
									location={location} globalConfig={listConfig}
								/>
							);
							break;
						default:
							return (
								<input
									value={colVal}
									onChange={e => {
										listData[rowIndex][column.dataField] = e.target.value;
										set_state({ listData: listData });
									}}
									onBlur={e => onChangeInput(e.target.value, item, rowIndex)}
								/>
							);
					}
				}
			});
		}
	});
	return columns2;


}
