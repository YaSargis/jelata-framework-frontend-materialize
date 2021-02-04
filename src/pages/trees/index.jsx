import React from 'react';

import { Icon, Menu } from 'antd';
const { SubMenu } = Menu;

import { Col, Row, Button, Dropdown, Preloader, CollectionItem  } from 'react-materialize';

// import MyHeader from 'src/pages/layout/header';

import List from 'src/pages/list';
import GetOne from 'src/pages/Getone';

import _ from 'lodash';
import Composition from 'src/pages/composition';
import ActionsBlock from 'src/pages/layout/actions';

import enhance from './enhance';
import Item from 'antd/lib/list/Item';


import { Link } from 'react-router-dom';

const Trees = ({
  history, location, getData, view, ready, openedKeys, menu,
  handlerOpenChange, handlerSelectMenu, values, params
}) => {
	function menuRender(arr, fnMenu) {
		return arr.map((menuItem, menuIndex) => {
			return menuItem.children ? (
				<Col>
					<Dropdown
						key={menuItem.key}
						id={'TREE_' + menuItem.key}
						options={{
							alignment: 'left', autoTrigger: true, closeOnClick: true, constrainWidth: true,
							container: null, coverTrigger: true, hover: false, inDuration: 150, onCloseEnd: null,
							onCloseStart: null, onOpenEnd: null, onOpenStart: null, outDuration: 250
						}}
						trigger={
							<div className='collapsible-header'>
								<Icon type={menuItem.icon || ''} />
								<span>{menuItem.label || '--'}</span>
							</div>
						}
					>
					  {fnMenu(menuItem.children, fnMenu)}
					</Dropdown>
				</Col>
			): (
				
				<Col onClick={() => handlerSelectMenu(menuItem)} >
					<div className='collapsible-header'>
						<Icon type={menuItem.icon || ''} />
						<span>{menuItem.label || '--'}</span>
					</div>
				</Col>
				
			)
		})
	}
	
	return (
		<Row
		  key='s222' 
		>
			<Row>
				<ActionsBlock
					actions={values.acts} origin={values} data={values.items}
					params={params} history={history} location={location}
					getData={getData}
				/>
			</Row>
			
			<Row style={{ margin: '0 10px' }}>
				
				{ menuRender(menu, menuRender) }
				
			</Row>
			
			<div>
				{(ready)? 
					(view.treeviewtype === 1)?
						(() => {
						  switch(view.viewtype) {
							case 'table':
							  return (
								<Row style={{ margin: '0 10px' }}>
									<List compo = {true} path = {view.path} history = {history} location={location} />
								</Row>
							  );
							case 'form full':
							case 'form not mutable':
							  return (
								<Row style={{ margin: '0 10px' }}>
									<GetOne compo = {true} path = {view.path} history = {history} location={location} />
								</Row>
							  )
						  }
						})()
					: (view.treeviewtype === 2)? (
						<Composition
							trees = {true} compo = {true} path = {view.path}
							history = {history} location={location} />
					) : null
				: <Preloader />
				}
			</div>
		</Row>
	)
};

export default enhance(Trees);
