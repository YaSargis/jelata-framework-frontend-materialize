import React from 'react';

import { Icon, Checkbox } from 'react-materialize';
import * as moment from 'moment';

import Select from 'src/pages/Getone/components/select';
import MultiSelect from 'src/pages/Getone/components/multiselect';
import Typeahead from 'src/pages/Getone/components/typehead';
import MultiTypehead from 'src/pages/Getone/components/multitypehead';
import { handlerGoLink, visibleCondition, dateFormat } from 'src/libs/methods';

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
					<Checkbox 
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
					/>	
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
						maxWidth: item.width, minWidth: item.width, padding: '5px 5px'
					},
					searchable: true,
					headerStyle: {
						width: item.width, maxWidth: item.width, minWidth: item.width
					},
					classes: item.col === '__actions__'? 'tab_actions' : classname ,

					sort: isorderby,
					sortCaret: (order, column) => {
						if (column.dataField !== 'rownum' && column.dataField !== '__actions__') {
							if (!order)
								return (
									<Icon style={{ fontSize: 12, display:'inline', marginLeft:3 }}>unfold_more</Icon>
								);
							else if (order === 'asc')
								return (
									<Icon style={{ fontSize: 12, display:'contents', marginLeft:3 }}>expand_less</Icon>
								);
							else if (order === 'desc')
								return (
									<Icon style={{ fontSize: 12, display:'contents', marginLeft:3 }}>expand_more</Icon>
								);
						}
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
								<input
									type={item.type}
									value={colVal}
									style={{border: '1px solid #9e9e9e', fontSize:14, height: '1.5rem', paddingLeft: '8px', margin: '0 0 0 0', padding: '0 0 0 0'}}
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
								<Checkbox 
									key={item.key}
									id={item.key}
									indeterminate={(colVal === null || colVal === undefined)? true : false}
									checked={colVal}
									onChange={(e)=>{
										console.log('EEEE:', e.target.value)
										let v = colVal
										if (v === null || v === undefined)
											v = true
										else if (v === true)
											v = false
										else
											v = null
										listData[rowIndex][column.dataField] = v;
										onChangeInput(v, item, rowIndex);
										set_state({ listData: listData });
									}}
									
								/>
							);
							break;
						case 'date':
							return (
								<input
									type='date'
									style={{border: '1px solid #9e9e9e', fontSize:14, height: '1.5rem', paddingLeft: '8px', margin: '0 0 0 0', padding: '0 0 0 0'}}									
									value={colVal ? dateFormat(colVal, 'date') : null}
									onChange={(e) => {
										listData[rowIndex][column.dataField] = e.target.value; //.target.value
										onChangeInput(e.target.value, item, rowIndex);
										set_state({ listData: listData });
									}}
								/>
							);
							break;
						case 'datetime':
							return (
								<input
									type='datetime-local'
									style={{border: '1px solid #9e9e9e', fontSize:14, height: '1.5rem', paddingLeft: '8px', margin: '0 0 0 0', padding: '0 0 0 0'}}									
									value={colVal ? dateFormat(colVal, 'datetime') : null}
									onChange={(e) => {
										listData[rowIndex][column.dataField] = e.target.value; //.target.value
										onChangeInput(e.target.value, item, rowIndex);
										set_state({ listData: listData });
									}}
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
