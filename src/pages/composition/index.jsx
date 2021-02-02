import React, { useState, useEffect } from 'react';
// import MyHeader from 'src/pages/layout/header';
import { Col, Row, Button, Icon } from 'react-materialize';
import List from 'src/pages/list';
import GetOne from 'src/pages/Getone';
import qs from 'query-string';

import { apishka } from 'src/libs/api';

const CompositionNew = ({ history, path, compo, location, match }) => {
	let [_state, setState] = useState({}), {
			loading = false,	values = {},
			id_page = null,	// pathname
			init = false,
			btnCollapseAll = true
		} = _state;

	const [inputs, setInputs] = useState(location.search)

	const set_state = (obj) => {
		let st = {..._state}, keys = _.keys(obj);
		keys.map( k => { st[k] = obj[k] });
		setState(st);
	};

	let _inputs = location.search;
	const getData = (_id, type) => {
		apishka(
			'GET', {},
			`/api/compobypath?path=${_id}&inputs=${JSON.stringify(qs.parse(location.search))}`,
			(res) => {
				document.title = res.outjson.title;
				set_state({
					id_page: _id, loading: false,
					init: type ? true : init,
					values: {...res.outjson}
				});
			},
			(err) => {}
		)
	};
	let _id = compo ? path : match.params.id; // if tree or composition in another component

	const collapseActivityState = () => {
		set_state({btnCollapseAll: !btnCollapseAll});
	}

	useEffect(() => {
		if((id_page !== _id && id_page !== null) /*|| (values.refresh && )*/) {
			setState({
				loading: true, values: {}
			});
			getData(_id);
		} else {
			_.isNull(id_page) ? getData(compo ? path : match.params.id, 'init') : null;
		}
	}, [_id]);

	if (inputs !== _inputs && values.visible_views) {
		setInputs(_inputs)
		getData(_id);
	}

	return (
		<div
			tabIndex={0}
			onKeyDown={e => {
				if (e.keyCode === 48 && e.altKey && e.ctrlKey) {
					collapseActivityState()
				}
			}}
		>
			<Row key='s2' style={{ margin: '0 10px' }} >
				<Col s={12} style={{ padding: '20px' }} >
					<Button 
						small onClick={ collapseActivityState }
						icon = {btnCollapseAll ? <Icon>remove</Icon> : <Icon>add</Icon> }
					/>
						
				</Col>
				<div>
					{loading? <Preloader id='prel' size='big' active={true} flashing={true} /> : null}
					{id_page === _id ? !loading ? values.config ? _.isArray(values.config)?
						values.config.map((Item, ikf) => {
							return (
								<Row key={ikf} justify='center' >
									{Item.cols.map((x, isk) => {
										if (
											!values.visible_views || (
												values.visible_views &&
												values.visible_views.filter((i) => i == x.path.id ).length > 0
										)) {
						 					return (
												<Col key={isk} s={(x.width > 12)? 12: x.width||  12}>
													{(() => {	switch(x.path.viewtype) {
														case 'table':
														case 'tiles':
															return <List compo = {true} path = {x.path.path} history = {history} location={location} btnCollapseAll={btnCollapseAll} />
														case 'form full':
														case 'form not mutable':
															return (
																<div>
																	<h4>{ null }</h4>
																	<GetOne compo = {true} path = {x.path.path}	history = {history} location={location} values={values} btnCollapseAll={btnCollapseAll} />
																</div>
															)
													}})()}
												</Col>
											)
										} else {
											return <div />
										}
									})}
								</Row>
							)
						}) : null : null : null : null
					}
				</div>
			</Row>
		</div>
	)
}

export default CompositionNew;
