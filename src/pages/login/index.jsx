import React from 'react'
import Helmet from 'react-helmet'

import { Form } from 'antd'

import { 
	List, Container, Typography, Box, Grid, Link, Checkbox, FormControlLabel, TextField, CssBaseline, Button
} from '@material-ui/core';



//import 'src/styles/index.scss'

import enhance from './enhance'

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
	handleSubmit, form, setTypeLogin, set_state, ready = true, authorize 
}) => {
	let { getFieldDecorator } = form
	return (
		<Container component='main' maxWidth='xs'>
			<Typography component="h1" variant="h5">{config.title}</Typography>			
			<form>
				{legacy ? [
					<Grid key='s1'>
						{getFieldDecorator('username', {
							rules: [{ message: 'Please input your username!' }],
						})(
							<TextField
								variant='outlined' margin='normal'
								required fullWidth
								id='email' label='Email Address'
								name='email' autoComplete='email'
								autoFocus
							/>
							)}
					</Grid>,
					<Grid key='s2'>
						{getFieldDecorator('password', {
							rules: [{ message: 'Please input your Password!' }],
						})(
							<TextField
								variant='outlined' margin='normal'
								required fullWidth
								name='password' label='Password'
								type='password' id='password'
								autoComplete='current-password'
							/>
						)}
					</Grid>
				] : [
					<Grid key='s1' className='sertificat_block'>
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
					</Grid>
				]}
				<Grid> {
						config.remember.visible ?
							getFieldDecorator('remember', {
								valuePropName: 'checked',
								initialValue: true,
							})(<Checkbox style={{ color: '#afb1be' }}>{config.remember.title || 'Remember me'}</Checkbox>) : null
					} {
						config.remember.visible ?
							<a className='login-form-forgot' href='/getone/forgotthepassword'>
								{ config.forgot.title || 'Forgot password' }
							</a> : null
					}
				</Grid>
				<Grid>
					<Button
						type='submit' fullWidth
						variant='contained'	color='primary'
						onClick = {handleSubmit}
					>
						Sign In
					</Button>

					<Grid>
						<span style={{ color: '#afb1be' }}>Or </span>
					</Grid>
					<Grid container>
						<Grid item xs>
							<Link href='#' variant='body2' disabled={!ready} onClick={onECP}>
								{ !legacy ? 'Log in by login/password' : 'Log in by digital signature'}
						   </Link>
						</Grid>							
					</Grid>														
				</Grid>
			</form>
		</Container>
	)
}

export default Form.create({ name: 'normal_login' })(enhance(LoginForm))
