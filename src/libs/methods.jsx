import React from 'react';
import { bools, actions } from 'src/defaults';
import qs from 'query-string';

import { apishka } from './api';

import {
  Icon
} from 'antd';

// import {MenuItem, MenuList, Menu, Collapse, ListItem, ListItemText, List} from '@material-ui/core';
// import CollapsibleItem from '@material-ui/core/CollapsibleItem';

import { CollapsibleItem, Collapsible, SideNavItem, Badge, Dropdown, Button } from 'react-materialize';

import { Link } from 'react-router-dom';


// const { SubMenu } = Menu;

/* save uersettings json ( some views settings ) */
export const saveUserSettings = (settings) => {
	apishka('POST', {settings: settings}, '/api/saveusersettings')
}

export function visibleCondition(data,visible_condition, inputs) {
	data = data || {}
	if (data[0])
		data = data[0]

	if (!inputs) {
		inputs = {}
	}
	if (!visible_condition || visible_condition.length === 0 ) {
		return true;
	} else {
		let a = true

		visible_condition.forEach((item) => {
			if (item.operation.js === ">") {
				if ((data[item.col.key]!==undefined  &&  data[item.col.key]!==null && data[item.col.key]>item.value) ||
				(data[item.col.key] === undefined && inputs[item.col.value]!==undefined && inputs[item.col.value]!==null  && inputs[item.col.value]>item.value)) {
					a = true && a
				} else {
					a = false
				}
			} else if (item.operation.js === "===") {
				if ( (data[item.col.key]!==undefined  && data[item.col.key]!==null && data[item.col.key].toString()===item.value) ||
					 (data[item.col.key] === undefined && inputs[item.col.value]!==undefined  && inputs[item.col.value]!==null && inputs[item.col.value].toString()===item.value)
				) {
					a = true && a
				} else {
					a = false
				}
			} else if (item.operation.js === "<") {
				if ((data[item.col.key]!==undefined  && data[item.col.key]!==null && data[item.col.key]<item.value) ||
					(data[item.col.key] === undefined && inputs[item.col.value]!==undefined  && inputs[item.col.value]!==null && inputs[item.col.value]<item.value)
				) {
					a = true && a
				} else {
					a = false
				}
			} else if (item.operation.js === "!==") {
				if ((data[item.col.key]!==undefined  && data[item.col.key]!==null && data[item.col.key].toString() !== item.value) ||
					(data[item.col.key] === undefined && inputs[item.col.value]!==undefined  && inputs[item.col.value]!==null && inputs[item.col.value].toString()!==item.value)
				) {
					a = true && a
				} else {
					a = false
				}
			} else if (item.operation.js === ">=") {
				if ((data[item.col.key]!==undefined && data[item.col.key]!==null && data[item.col.key] >= item.value) ||
					(data[item.col.key] === undefined && inputs[item.col.value]!==undefined  && inputs[item.col.value]!==null && inputs[item.col.value]>=item.value)
				) {
					a = true && a
				} else {
					a = false
				}
			} else if (item.operation.js === "<=") {
				if ((data[item.col.key]!==undefined && data[item.col.key]!==null && data[item.col.key] <= item.value) ||
					(data[item.col.key] === undefined && inputs[item.col.value]!==undefined && inputs[item.col.value]!==null && inputs[item.col.value]<=item.value)
				) {
					a = true && a
				} else {
					a = false
				}
			} else if (item.operation.js === "===null" ) {
				if (data[item.col.key] === null || data[item.col.key] === undefined ) {
					a = true && a
				} else {
				a = false
				}
			} else if (item.operation.js === "!==null" ) {
				if (!(data[item.col.key] === null || data[item.col.key] === undefined )) {
					a = true && a
				} else {
					a = false
				}
			} else if (item.operation.js === "indexOf") {
				if ((data[item.col.key] && (data[item.col.key]).indexOf(item.value)!==-1) || (inputs[item.col.value] &&(inputs[item.col.value]).indexOf(item.value)!==-1)) {
					a = true && a
				} else {
					a = false
				}
			} else if (item.operation.js === "likeOr") {
				const arr = item.value.split(',');
				if(_.isEmpty(arr)) {
					return a = false;
				}
				const presenceToArray = (value) => {
					let result = false;
					let arrBooleans = [];
					[value].forEach((item) => {
						arr.forEach((it)=>{
							let itemResult = item.includes(it);
							arrBooleans.push(itemResult);
						})
					});
					(arrBooleans.find((item) => item === true)) ? result = true : null;
					return result;
				}
				if ((data[item.col.key] && presenceToArray(data[item.col.key])) || (inputs[item.col.value] && presenceToArray(inputs[item.col.value]) )) {
					a = true && a
				} else {
					a = false
				}
			}
			else if (item.operation.js === "in") {
				if ( item.value.split(',').filter((x) => data[item.col.key] !== null && data[item.col.key] !== undefined  && x.toString() === data[item.col.key].toString()).length > 0) {
					a = true && a
				} else {
					a = false
				}
			} else if (item.operation.js === "not in") {
				if ( item.value.split(',').filter((x) => data[item.col.key] !== null && data[item.col.key] !== undefined && x === data[item.col.key].toString()).length === 0) {
					a = true && a
				} else {
					a = false
				}
			} else if (item.operation.js === "contain") {
				if (typeof(data[item.col.key]) === 'object'  && (data[item.col.key] || []).filter((x) => x == item.value).length > 0 )
					a = true
				else
					a = false
			}
		})
		return a
	}
}


/* build Link type action query by action parameters config */
export const QueryBuilder = (item, el, config, inputs, checked) => {

  // for every row actions
	let { parametrs, paramtype } = el,
		_query = '';

	if(parametrs) {
    //if(paramtype && paramtype === 'link') {

		let link_parametrs = parametrs.filter((x) => x.query_type === 'link')
		if (link_parametrs.length > 0) _query = '/';

		link_parametrs.forEach((obj, index) => {
			if (obj.paramcolumn) {
				_query += item[(_.find(config, o => o.title === obj.paramcolumn.value) || {}).key] + '/'
			}
			else if (obj.paraminput) {
				_query += inputs[obj.paraminput] + '/'
			}
			else {
				let cConst = obj.paramconst
				if (cConst === '_checked_')
					cConst = JSON.stringify(checked || [])
					_query += cConst + '/';
			}
			parametrs.length !== index+1 ? _query += '&' :  null
		})

		let query_parametrs = parametrs.filter((x) => x.query_type === 'query')
		if (query_parametrs.length > 0) _query += '?';

		query_parametrs.forEach((obj, index) => {
			if(!obj.paramt || obj.paramt === 'sample') {
				if(obj.paramcolumn) {
					_query += obj.paramtitle + '=' + item[(_.find(config, o => o.title === obj.paramcolumn.value) || {}).key]
				}
				else if (obj.paraminput) {
					_query += obj.paramtitle + '=' + inputs[obj.paraminput]
				}
				else {
					let cConst = obj.paramconst
					if (cConst === '_checked_')
						cConst = JSON.stringify(checked || [])
					_query += obj.paramtitle + '=' + cConst;
				}
				parametrs.length !== index+1 ? _query += '&' :  null
			};
		})
	}
	return _query;
};

/* build Link type action query by action parameters config */
export function QueryBuilder2(item, itm, config, inputs, checked) {

  // for one row actions

	if (item && item[0]) {
		item = item[0]
	}
	let squery = ''
	if (itm.act.indexOf('?') === -1)
		squery = '?'
	if (itm.parametrs) {
		itm.parametrs.forEach((obj) => {
			if (obj.paramcolumn) {
				let opc = obj.paramcolumn;
				squery += obj.paramtitle + "=" + (
					item[(_.find(config, (o)=> ( o.title === opc.value || (o.fn && o.title === opc.value)  )) || {}).key]
					|| inputs[(_.find(config, ((o)=> o.title === opc.value)) || {}).title]
				) + '&'
			}
			else if (obj.paraminput) {
				squery += obj.paramtitle + '=' + inputs[obj.paraminput] + '&'
			}
			else {
				let cConst = obj.paramconst
				if (cConst === '_checked_')
					cConst = JSON.stringify(checked || [])
				squery += (obj.paramtitle ? obj.paramtitle + "=" : '') + cConst + '&'
			}
		})
	}

	squery = squery.substring(0,squery.length-1)
	return squery
}

/* build API method body by action parameters config */
export function bodyBuilder(itm, inputs, config, data, checked) {
  // item - inputs

	let body = {}
	if (itm.parametrs) {
		itm.parametrs.map((obj) => {
			if (!obj.paramt || obj.paramt === 'simple')
				if (obj.paramcolumn) {
					if  (  data && data[0]) {
						body[obj.paramtitle] = data[0][(config.filter((x)=> (
					        x.col === obj.paramcolumn.label || x.title === obj.paramcolumn.value
						))[0] || {}).key];
					};

					if (!body[obj.paramtitle] && data) {
						body[obj.paramtitle] = data[(config.filter((x)=> (
							x.col === obj.paramcolumn.label || x.title === obj.paramcolumn.value
						))[0] || {}).key];
					}

					if  ( !body[obj.paramtitle]) {
						body[obj.paramtitle] = inputs[obj.paramcolumn.value];
					};
				}
				else if (obj.paraminput) {
					body[obj.paramtitle] = inputs[obj.paraminput]
				}
				else {
					let cConst = obj.paramconst
					if (cConst === '_checked_')
						cConst = JSON.stringify(checked || [])

					body[obj.paramtitle] = cConst;

				}
		})
	};
	return body;
}


/*

 * @param {*} item
 * @param {*} el
 * @param {*} config
 * @param {*} inputs - props.location.search
 * @param {*} history - props.history
 */

/* use in list */
export const handlerGoLink = (item, el, config, inputs, history) => {
	let url = ''
	if(!el.isforevery) {
		url = QueryBuilder2(item, el, config, inputs)
	} else {
		url = QueryBuilder(item, el, config, inputs);
	};
	history.push(el.act + url);
};


/*

						<div>
						{							
							<div style={{'justifyContent':'flex'}}>
								<Icon type={el.icon} />
								<ListItemText primary={(el.istitle)? el.title : null } />

								{(el.ws)? <b style={{color:'blue'}}>{' ' + el.notif_count}</b> : null}	
							</div>
						}
						</div>
*/

export const menu_creator = () => (menu_creator, items) => {
    if(Array.isArray(items)) if(items.length > 0) {
		return items.map((el,i) => {
			if(el.childs && el.childs > 0) {
				return (
					<Collapsible style={{padding:0}} key={el.id + '_A'} accordion>
						<CollapsibleItem 
							key={el.id}
							expanded={false} header={(el.istitle)? el.title : null }
							icon={<Icon small type={el.icon} />}
						> 
							<div style={{marginLeft:'10px'}}>{ menu_creator(menu_creator, el.items || []) }</div>
						</CollapsibleItem >
					</Collapsible>
				)
			} else {
				return (
					<SideNavItem style={{padding:0}} icon={<Icon type={el.icon} />} >
						<li >
							<Link to={el.to} title={ el.title } style={{whiteSpace: 'nowrap', color:'#039be5'}}>
								{(el.istitle)? el.title : null }
								{(el.ws)? <Badge className='blue'>{' ' + el.notif_count}</Badge> : null}
							</Link>
						</li>
					</SideNavItem>
			   )
			}
		})
    } else return null;
};

export const menu_creator_header = () => (menu_creator_header, items) => {
    if(Array.isArray(items)) if(items.length > 0) {
		return items.map((el,i) => {
			if(el.childs && el.childs > 0) {
				return (
					<Dropdown
						id="Dropdown_6"
						options={{
							alignment: 'left', autoTrigger: true, closeOnClick: true, constrainWidth: true,
							container: null, coverTrigger: true, hover: false, inDuration: 150, onCloseEnd: null,
							onCloseStart: null, onOpenEnd: null, onOpenStart: null, outDuration: 250
						}}
						trigger={<div><Icon style={{marginRight:10}} small type={el.icon} /><span>{(el.istitle)? el.title : null }</span></div>}
					>
						<div style={{marginLeft:'10px'}}>{ menu_creator_header(menu_creator, el.items || []) }</div>
					</Dropdown >
					
				)
			} else {
				return (
				<li>
					<Link to={el.to} title={ el.title } style={{whiteSpace: 'nowrap'}}>
						<Icon small type={el.icon} />
						{(el.istitle)? el.title : null }
						{(el.ws)? <Badge className='blue'>{' ' + el.notif_count}</Badge> : null}
					</Link>
				</li>
			   )
			}
		})
    } else return null;
};

export const dateFormat = (dt, c_type) => {
	let dt2 = ''
	if (dt && typeof(dt) === 'string') {
		if (c_type === 'date') {
			dt.split('.').reverse().forEach((x) => dt2 += '-' + x)
			dt2 = dt2.slice(1)
		} else if (c_type === 'datetime') {
			let tm = dt.split(' ')[1]
			dt = dt.split(' ')[0]			
			dt.split('.').reverse().forEach((x) => dt2 += '-' + x)
			dt2 = dt2.slice(1) + 'T' + tm
		} else if (c_type === 'time') {
			dt2 = dt			
		}
	} else dt2 = dt
	return dt2
}