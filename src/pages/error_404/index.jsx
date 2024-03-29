import React from 'react'
import {Button, Card} from 'react-materialize'

let goBack = (((LaNg || {}).goBack ||{})[LnG || 'EN'] || 'go back')
const Error_404 = ({history, location}) => {
	return (
		<Card>
			<h1 style={{fontSize:200, color:'pink'}}>404</h1>
			<Button type="primary" onClick={() => history.goBack()} >{goBack}</Button>
		</Card>
	)
}

export default Error_404
