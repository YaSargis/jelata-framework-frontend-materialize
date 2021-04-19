import React, { useState } from 'react'

import { NotificationManager } from 'react-notifications'


import { 
	Col, Card, Checkbox, Button, Icon, Modal, Row
} from 'react-materialize'

import { apishka } from 'src/libs/api'
//import 'src/styles/index.scss'

import enhance from './enhance'


let passwordPlaceholder = (((LaNg || {}).passwordPlaceholder ||{})[LnG || 'EN'] || 'password')

let plLogin = (((LaNg || {}).plLogin ||{})[LnG || 'EN'] || 'login')
let loginForm = (((LaNg || {}).loginForm ||{})[LnG || 'EN'] || 'Log In')
let signIn = (((LaNg || {}).signIn ||{})[LnG || 'EN'] || 'sign in')
let oOr = (((LaNg || {}).oOr ||{})[LnG || 'EN'] || 'or')
let logSig = (((LaNg || {}).logSig ||{})[LnG || 'EN'] || 'Log in by digital signature')
let logPas = (((LaNg || {}).logPas ||{})[LnG || 'EN'] || 'Log in by login/password')
let Error = (((LaNg || {}).Error ||{})[LnG || 'EN'] || 'Error')
let noCryptoPlugin = (((LaNg || {}).noCryptoPlugin ||{})[LnG || 'EN'] || 'Can not found the  crypto plugin')

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
					localStorage.setItem('thumbprint', select_scp.thumbprint)
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
							setSertificats( res.certs )
						}).catch(err => {

							NotificationManager.error(Error, err.status || {noCryptoPlugin}, 1000)

						})
					} else {
						NotificationManager.error(Error, {noCryptoPlugin}, 1000)
					}
				} 
			}
			setLegacy(!legacy)
		}
	
	return (
		<div>
			
			<Modal 
				open={modal}
				trigger={<Button style={{color: 'blue', textDecoration: 'underline'}} flat node='button'>{signIn}</Button>}
				actions={[
					<Button flat modal="close" node="button" waves="green">X</Button>
				]}
			>
				<Col>
					<h5>{loginForm}</h5>			
					{legacy ? [
						<Col>
							<input
								placeholder={plLogin} id='email'
								style={inputStyles}
								onChange={(e) => setLogin(e.target.value)}
							/>
							
								
						</Col>,
						<Col key='s2'>
							<input
								type='password' id='password'
								placeholder={passwordPlaceholder} style={inputStyles}
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
							<Button onClick={handleSubmit}>{signIn}</Button>
						</Col>
						<Col>
							<label style={{ color: '#afb1be' }}>{oOr}</label>
						</Col>
						<Col>
							<Button flat onClick={() => {
								onECP()
							}}>
								{ !legacy ? logPas : logSig }
							</Button>						
						</Col>														
					</Row>
				</Col>
			</Modal>
		</div>
	)
}

export default LoginForm
