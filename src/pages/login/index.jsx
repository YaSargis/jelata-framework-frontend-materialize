import React, { useState } from 'react'

import { NotificationManager } from 'react-notifications'


import { 
	Col, Card, Checkbox, Button, Icon, Modal, Row
} from 'react-materialize'

import { apishka } from 'src/libs/api'
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

const LoginForm = () => {
	const [legacy, setLegacy] = useState(true)
	const [modal, setModal] = useState(true)
	const [select_scp, setSelectScp] = useState()
	const [login, setLogin] = useState('')
	const [pass, setPass] = useState('')
	const [sertificats, setSertificats] = useState([])
	
	const inputStyles = {border: '1px solid #9e9e9e', height: '2.5rem', paddingLeft: '8px', fontSize:'15px', borderRadius:'5px'}

	const handleSubmit = () => {
		if (legacy === true) {
			apishka( 
				'POST', {
					login: login, pass: pass
				}, '/auth/auth_f', (res) => {
					location.href='/'
				}
			)
		} else {
			apishka( 
				'POST', select_scp, '/auth/auth_crypto', (res) => {
					location.href='/'
				}
			)
		}
	}
	
	const onECP = () => {
			if ( legacy ) {
				if ( sertificats.length === 0 ) {
					if ( authorize ) {
						authorize.ecpInit().then(res => {
							console.log('CERTS:', res)
							setSertificats( res.certs )
						}).catch(err => {

							NotificationManager.error('Error', err.status || 'Can not found the module', 100)

						})
					} else {
						NotificationManager.error('Error', 'Can not fount the module', 100)
					}
				} 
			}
			setLegacy(!legacy)
		}
	
	return (
		<div>
			
			<Modal 
				open={modal}
				trigger={<Button style={{color: 'blue', textDecoration: 'underline'}} flat node='button'>LogIn</Button>}
			>
				<Col>
					<h5>{config.title}</h5>			
					{legacy ? [
						<Col>
							<input
								placeholder='login' id='email'
								style={inputStyles}
								onChange={(e) => setLogin(e.target.value)}
							/>
							
								
						</Col>,
						<Col key='s2'>
							<input
								type='password' id='password'
								placeholder='password' style={inputStyles}
								onChange={(e) => setPass(e.target.value)}
								onKeyUp={(e) => {
									if (e.key === 'Enter') {
										handleSubmit()
									}
								}}
							/>
						</Col>
					] : [
						<Col>
							<ul>
								{sertificats.map((item) => (
									<li style={{'cursor':'pointer', backgroundColor:(select_scp && item.id === select_scp.id)? 'grey' : 'white'}} onClick={() => setSelectScp(item) } > {item.sname} {item.valid}</li>
								))}
							</ul>
						</Col>
					]}
					<Row>
						<Col>
							<Button onClick={handleSubmit}>Sign In</Button>
						</Col>
						<Col>
							<label style={{ color: '#afb1be' }}>or</label>
						</Col>
						<Col>
							<Button flat onClick={() => {
								onECP()
							}}>
								{ !legacy ? 'Log in by login/password' : 'Log in by digital signature' }
							</Button>						
						</Col>														
					</Row>
				</Col>
			</Modal>
		</div>
	)
}

export default LoginForm
