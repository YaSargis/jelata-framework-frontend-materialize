import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { config } from 'src/defaults';

//import { Icon  /*Grid,*/ } from 'antd';
//const { /*Header,*/ Sider, Content } = Layout;
import _ from 'lodash';
import Helmet from 'react-helmet';

import enhance from './enhance';

import Home from 'src/pages/Home';
import GetOne from 'src/pages/Getone';
import LoginForm from 'src/pages/login';
import Logout from 'src/pages/logout';
import List from 'src/pages/list';
import Composition from 'src/pages/composition';
import Trees from 'src/pages/trees';
import Report from 'src/pages/report';
import Error_404 from 'src/pages/error_404'
// import {} from '@material-ui/core'
import { Collapsible, Button, SideNav, SideNavItem, Icon as MIcon, Breadcrumb, Footer, Col } from 'react-materialize';
import 'materialize-css'


/*
								<div>
									<img
										width='90px'
										alt={} 
										className='circle'
										src={}
									/>	
									<Grid>
										<span style={{ color: 'white' }}>
											{!collapsed ? (user_detail.fam || '') + ' ' + (user_detail.im || '') : null}
										</span>
									</Grid>
									{config.userorg ? (
										<Grid>
											<Link to={config.userorg}>
												{!collapsed ? user_detail.orgname || '' : <Icon title='org' type='setting' />}
											</Link>
										</Grid>
								) : null}
								</div>
*/


const App = ({
	user_detail, collapsed, custom_menu, cxs, menu_creator_header,
	menu_creator, menuCollapseStateSave, getMenu
}) => {
    return (

        <div>
            <Helmet>
                <meta charset='utf-8' />
            </Helmet>
			<div position='fixed' >
				<div>	
					<Breadcrumb className='teal' cols={12}>
						{custom_menu ? (
							_.find(custom_menu, item => item.menutype === 'Header Menu') ? (
								<ul>
									{menu_creator_header(
										menu_creator_header,
										_.find(custom_menu, item => item.id === 2).menu,
										false
									)}
								</ul>
							) : null
						) : null}
					</Breadcrumb>
				</div>	
			</div>
			<Col  container >
				<Col item> 
					{(
						custom_menu &&
						custom_menu.filter((mn) => mn.menutype === 'Left Menu').length>0 &&
						custom_menu.filter((mn) => mn.menutype === 'Left Menu')[0].menu &&
						custom_menu.filter((mn) => mn.menutype === 'Left Menu')[0].menu.length > 0
					)? (

						<SideNav
							id='SideNav-10'
							options={{
							  draggable: true
							}}
							trigger={
								<Button small node='button' icon={<MIcon small>menu</MIcon>} className='blue' />
							}
						>
							{config.profile === true ? (
									<SideNavItem
										user={{
											background: '/src/public/material_back.jpg',
											email: (user_detail.login || ''),
											image: (user_detail.photo || null),
											name: (user_detail.fam || '') + ' ' + (user_detail.im || ''),
											
										  }}
										  userView
									/>
								) : null
							}
							{config.profile === true ? (
									<SideNavItem>
										<Link to={config.userorg}>
											<MIcon tiny >settings</MIcon>  {' '}{user_detail.orgname || ''} 
										</Link>
									</SideNavItem>
								):null
							}
							{custom_menu ? (
								_.find(custom_menu, item => item.menutype === 'Left Menu') ? (
									<Collapsible accordion>
										{menu_creator(menu_creator, _.find(custom_menu, item => item.id === 1).menu, false)}
									</Collapsible>
								) : null
							) : null}
						</SideNav >
					) : null}
				</Col> 
				<Col item> 
					<Switch>
						<Route path='/' component={Home} exact />
						<Route path='/home' component={Home} exact />
						<Route path='/login' component={LoginForm} exact />
						<Route path='/getone/:id_page' component={GetOne} exact />
						<Route path='/list/:id' component={List} exact />
						<Route path='/tiles/:id' component={List} exact />
						<Route path='/composition/:id' component={Composition} exact />
						<Route path='/trees/:id' component={Trees} exact />
						<Route path='/report/:id' component={Report} />
						<Route path='/logout' component={Logout} exact />
						<Route component={Error_404} />
					</Switch>
					<Button 
						small 
						style={{
							 position: 'fixed', bottom: 20,
							left : 30
						}}
						onClick = {() => {
							document.body.scrollTop = 0; // For Safari
							document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera	
						}}
						icon={<MIcon tiny>keyboard_arrow_up</MIcon>} 
					/>
					{(localStorage.getItem('ischat') === true || localStorage.getItem('ischat') === 'true') ? (
							<Link to='/composition/chats'>
								<MIcon 
									small
									style={{
										fontSize: 40, color: '#1890ff', position: 'fixed', bottom: 20,
										right: 30
									}}
								 >message</MIcon>
							</Link>
						) : null}
				</Col>
			</Col>

			<Col>
				<div className='ant-back-top-inner'>
					
				</div>
			</Col>
		</div>
    );
};

/*
									{menu_creator_header(
										menu_creator_header,
										(_.find(custom_menu, item => item.id === 3) || {}).menu,
										false
									)}

*/

export default enhance(App);
