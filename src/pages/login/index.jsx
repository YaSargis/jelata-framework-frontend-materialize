import React from 'react';
import Helmet from 'react-helmet';

import { Tabs, Form, Icon, Input, Button, Checkbox, List } from 'antd';

const { TabPane } = Tabs;

import 'src/styles/index.scss';

import enhance from './enhance';

let config = {
	title: 'Log in', login: 'Login',
	pass: 'Password', remember: {
		visible: true, title: 'Remember me',
	},
	forgot: {
		visible: true, title: 'Forgot the password'
	}
}

const LoginForm = ({
	legacy, sertificats, select_scp, onSelectSert, onECP,
	handleSubmit, form, setTypeLogin, set_state, ready = true
}) => {
	let { getFieldDecorator } = form;
	return (
		<div className={'tilt-in-fwd-tr login ' + (legacy ? '' : 'ecp_form_login') }>
			<div className='login_title'>
				<span>{config.title}</span>
			</div>
			<div className='login_fields'>
				<Form onSubmit={handleSubmit} className='login-form'>
					{legacy ? [
						<Form.Item key='s1'>
							{getFieldDecorator('username', {
								rules: [{ message: 'Please input your username!' }],
							})(
								<Input
									prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder='Username'
								/>
							)}
						</Form.Item>,
						<Form.Item key='s2'>
							{getFieldDecorator('password', {
								rules: [{ message: 'Please input your Password!' }],
							})(
								<Input
									prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
									type='password'
									placeholder='Password'
								/>
							)}
						</Form.Item>
					] : [
						<Form.Item key='s1' className='sertificat_block'>
							{getFieldDecorator('certificate', {
							  rules: [{ message: 'Please select your certificat!' }],
							})(
								<List
									size='small'
									dataSource={sertificats}
									renderItem={item => (
										<List.Item key={item.id}
											className={ 'item_select_sert ' + (item.thumbprint === select_scp.thumbprint ? 'active' : '') }
											onClick={() => onSelectSert(item) }
										>
										<List.Item.Meta
										  title={item.sname}
										  description={item.valid}
										/>
									  </List.Item>
									)}
								/>
							)}
						</Form.Item>
					]}
					<Form.Item>
						{
							config.remember.visible ?
								getFieldDecorator('remember', {
									valuePropName: 'checked',
									initialValue: true,
								})(<Checkbox style={{ color: '#afb1be' }}>{config.remember.title || 'Remember me'}</Checkbox>) : null
						}
						{
							config.remember.visible ?
								<a className='login-form-forgot' href=''>
									{ config.forgot.title || 'Forgot password' }
								</a> : null
						}
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' className='login-form-button'>
							Log In
						</Button>
						<span style={{
							display: 'flex',
							justifyContent: 'space-between'
						}}>
							<span>
								<span style={{ color: '#afb1be' }}>Or </span>
								{}
							</span>
							<Button style={{ margin: '7px 0' }} size='small' type='dashed' ghost disabled={!ready} onClick={onECP}>
								{ !legacy ? 'Log in by login/password' : 'Log in by digital signature'}
							</Button>
						</span>
					</Form.Item>
				</Form>
			</div>
		</div>
	)
}

export default Form.create({ name: 'normal_login' })(enhance(LoginForm));
