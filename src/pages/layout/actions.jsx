import React from 'react';
import qs from 'query-string';

import axios from 'axios';

import { compose, lifecycle, withHandlers } from 'recompose';

import { Tooltip, Icon, Popconfirm, notification, Modal, Spin } from 'antd';

import { visibleCondition, switchIcon, QueryBuilder, QueryBuilder2, bodyBuilder } from 'src/libs/methods';

import { PostMessage, Delete, Get, Put, apishka } from 'src/libs/api';
//import { MyIcons } from 'src/libs/icons';

import Getone from 'src/pages/Getone';
import List from 'src/pages/list';

//import { toggleLoading } from 'src/redux/actions/helpers';

const ActionsBlock = ({
	actions, data, params,
	loading, type = 'form', checked,
	onSave, goBack, goLink,goLinkTo, onDelete,
	onCallApi, popup, calendar, onModal//, toggleLoading
}) => {
	if(calendar) type = 'table';
	let _actions = _.filter(actions, x => {
		x.isforevery = x.isforevery || false;
		x.isforevery = _.isNumber(x.isforevery) ? x.isforevery === 1 ? true : false : x.isforevery;
		if (x.isforevery === (type === 'table') && visibleCondition(data, x.act_visible_condition, params.inputs)) return x;
	});
	return _actions.filter((act)=>act.type !== 'onLoad' &&  act.type !== 'Expand').map( (el, i) => {
		let _value = (type !== 'table') ? <span>{el.title}</span> : null,
			_val = el.title,
			place_tooltip = (type !== 'table') ? 'topLeft' : 'left';

		const onAction = (el) => {
			switch (el.type) {
				case 'Link':
					goLink(el)
					break;
				case 'LinkTo':
					goLinkTo(el)
					break;
				case 'Back':
					goBack(el)
					break;
				case 'API':
					onCallApi(el)
					break;
				case 'Save':
					onSave(el)
					break;
				case 'Save&Redirect':
				  onSave(()=>goLink(el));
					 //goLink(el);
			  break;
				case 'Delete':
				  onDelete(el)
					break;
				case 'Modal':
				  onModal(el)
					break;
				case undefined:
					goLink(el)
					break;
		}}

		const FmButton = (props) => {
			let el = props.el
			return (
				<button
					className={'fm-btn fm-btn-sm ' + el.classname}
					size='small'
					title={el.title}
					onClick={()=>{
						if (props.confirmed)
							onAction(el)
					}}
				>
					<Icon type={el.icon} />
					{ _value }
				</button>
			)
		}

		return (
			<Tooltip key={'s1'+i} placement={place_tooltip} title={el.title || ''}>
				{((el.actapiconfirm === true &&  el.type === 'API') || el.type === 'Delete')? (
					<Popconfirm placement="bottom" title="Confirm" okText="Yes" cancelText="No" onConfirm = {()=>onAction(el)}>
						<a style={{display:'hide'}}/>
						<FmButton confirmed={false} el = {el} />
					</Popconfirm>
				) : <FmButton confirmed={true} el = {el} />}
			</Tooltip>
		)
  });
};

const enhance = compose(

	withHandlers({

	}),
	withHandlers({
		goLink: ({ data, origin, location, history, checked }) => (el) => {
			let url = ''
			if(!el.isforevery) {
				url = QueryBuilder2(data, el, origin.config, location ? qs.parse(location.search) : {}, checked);
			} else {
				url = QueryBuilder(data, el, origin.config,  location ? qs.parse(location.search) : {}, checked);
			};
			history.push(el.act + url);
		},
		goLinkTo: ({ data, origin, location, history,checked }) => (el) => {
			let url = ''
			if(!el.isforevery) {
				url = QueryBuilder2(data, el, origin.config, location ? qs.parse(location.search) : {}, checked);
			} else {
				url = QueryBuilder(data, el, origin.config, location ? qs.parse(location.search) : {}, checked);
			};
			window.open(el.act + url);
		},
		onCallApi: ({
			getData, origin = {}, data, location,
			params, checked, setLoading
		}) => (config_one) => {
			setLoading(true);
			let uri = config_one.act;
			function call() {
				let body = {}
				if (config_one.actapitype === "GET") {
					uri = uri + QueryBuilder(data, config_one, origin.config, location ? qs.parse(location.search) : null, checked);
				} else {
					body = bodyBuilder(config_one, params.inputs, origin.config, data, checked);
				}
				let id_key = origin.config.filter((item) => item.col.toUpperCase() === 'ID' && !item.fn && !item.related )[0].key
				apishka( config_one.actapitype, body, uri,
					(res) => {
						if (res && res.message) {
							notification['success']({
								message: res.message
							});
						}
						if (res && res._redirect) {
							window.location.href = res._redirect
						}
						if (!config_one.isforevery) {
							getData(data[id_key], getData);
						} else {
							getData(getData, {});
						}
					},
					(err) => {
						setLoading(false);
					}
				);
			}
			if (!config_one.actapimethod || config_one.actapimethod === 'simple') {
				call();
			} 
			else setLoading(false); 

		},
		onDelete: ({ getData, data, origin, setLoading }) => () => {
			setLoading(true);
			let id_title = _.filter(origin.config, o => o.col.toUpperCase() === 'ID' && !o.fn && !o.relatecolumn)[0].key;
			apishka(
				'DELETE', {
					tablename: origin.table,
					id: data[id_title],
					viewid: origin.viewid ||origin.id
				}, '/api/deleterow',
				(res) => {
					getData(getData);
				},
				(err) => {
					setLoading(false);
				}
			);
		},
		onModal: ({getData, origin, data, location, history}) => (act) => {
			const typeContent = act.act.split('/')[1];
			let inputs = QueryBuilder(data, act, origin.config, history);

			if(!act.isforevery)
				inputs = QueryBuilder2(data, act, origin.config, location ? qs.parse(location.search) : {});

			let search = { search: inputs, pathname: act.act };

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
						);
					case 'tiles':
						return (
							<div>
								<List
									compo={true} location={search} history = {history}
									path={act.act.split('/')[2]} id_page={act.act.split('/')[2]}
								/>
							</div>
						);
					case 'getone':
						return (
							<div>
								<Getone
									compo={true} location={search} history = {history}
									path={act.act.split('/')[2]} id_page={act.act.split('/')[2]}
								/>
							</div>
						);
					default:
						const openNotification = () => {
							notification.open({
								message: `type ${typeContent} not correct  `,
								description: 'use list or getone'
							});
						};
					return openNotification;
				}
			}
			Modal.success({
				title: act.title,
				okType:'dashed',
				width:'85%',
				content: (
					<div style = {{width:'100%'}}>
						{ModalContent(typeContent, search, act)}
					</div>
				),
				okText: <Icon type ='close' />,
				onOk: () => {
					let id_key = origin.config.filter((item) => item.col.toUpperCase() === 'ID' && !item.fn && !item.related )[0].key
					if (!act.isforevery) {
						getData(data[id_key], getData);
					} else {
						getData(getData, {});
					}
				}
			})
		},
		goBack: ({ history }) => () => {
			history.goBack();
		}
	}),
);

export default enhance(ActionsBlock);
