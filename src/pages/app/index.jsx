import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { config } from 'src/defaults';

import { BackTop, Icon, Layout, Menu, Avatar, Row, Button, Modal } from 'antd';
const { Header, Sider, Content, Footer } = Layout;
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
import Error_404 from 'src/pages/error_404';

const App = ({
	user_detail, collapsed, custom_menu,
	menu_creator, menuCollapseStateSave, getMenu
}) => {
    return (
        <Layout className='lay' style={{ minHeight: '100vh' }}>
            <Helmet>
                <meta charset='utf-8' />
            </Helmet>
            {(
				custom_menu &&
				custom_menu.filter((mn) => mn.menutype === 'Left Menu').length>0 &&
				custom_menu.filter((mn) => mn.menutype === 'Left Menu')[0].menu &&
				custom_menu.filter((mn) => mn.menutype === 'Left Menu')[0].menu.length > 0
            )? (
				<Sider collapsible collapsed={collapsed} onCollapse={collapsed => {menuCollapseStateSave(collapsed)}}>
					{config.profile === true ? (
						<Row className='profile'>
							<Avatar size={72} shape='cyrcle' src={user_detail.photo || null} icon='user' />
							<Row>
								<span style={{ color: 'white' }}>
									{!collapsed ? (user_detail.fam || '') + ' ' + (user_detail.im || '') : null}
								</span>
							</Row>
							{config.userorg ? (
								<Row>
									<Link to={config.userorg}>
										{!collapsed ? user_detail.orgname || '' : <Icon title='org' type='setting' />}
									</Link>
								</Row>
							) : null}
						</Row>
						) : null
					}
		            {custom_menu ? (
						_.find(custom_menu, item => item.menutype === 'Left Menu') ? (
							<Menu theme='dark' mode='vertical' inlineCollapsed={collapsed} subMenuOpenDelay={0.4}>
								{menu_creator(menu_creator, _.find(custom_menu, item => item.id === 1).menu, false)}
							</Menu>
						) : null
		            ) : null}
				</Sider>
		    ) : null}
            <Layout>
                <Header style={{ padding: '0' }}>
					{custom_menu ? (
						_.find(custom_menu, item => item.menutype === 'Header Menu') ? (
							<Menu mode='horizontal'>
								{menu_creator(
									menu_creator,
									_.find(custom_menu, item => item.id === 2).menu,
									false
								)}
							</Menu>
						) : null
					) : null}
                </Header>
                <Content>
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
					{(localStorage.getItem('ischat') === true || localStorage.getItem('ischat') === 'true') ? (
							<Link to='/composition/chats'>
								<Icon 
									className='dashboard__icon-chat' title='Chat'
									type='message' 
									style={{
										fontSize: 40, color: '#1890ff', position: 'fixed', bottom: 20,
										right: 30
									}}
								 />
							</Link>
						) : null}
				</Content>
                <Footer style={{ padding: '10px' }}>
					{custom_menu ? (
						_.find(custom_menu, item => item.menutype === 'Footer Menu') ? (
						<Menu>
							{menu_creator(
								menu_creator,
								_.find(custom_menu, item => item.id === 3).menu,
								false
							)}
						</Menu>
					) : null) : null}
				</Footer>
			</Layout>
			<BackTop>
				<div className='ant-back-top-inner'>
					<Button type='primary'>
						<Icon type='up-circle' />
					</Button>
				</div>
			</BackTop>
		</Layout>
    );
};

export default enhance(App);
