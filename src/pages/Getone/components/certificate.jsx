import React from 'react'
import { compose, lifecycle, withStateHandlers, withHandlers } from 'recompose'
import {Button} from 'react-materialize'

let certList = (((LaNg || {}).certList ||{})[LnG || 'EN'] || 'list:')
let certButton = (((LaNg || {}).certButton ||{})[LnG || 'EN'] || 'Сhoose certificate')

const Certificate = ({
	data, config, open = false, options = [],
	set_state, onSave, onOpen, onSelect
}) => {
	let value = data[config.key]
	return [
		<div>
			<Button onClick={onOpen} key='c1'>
				{certButton}
			</Button>
			{(open)? (
					<ul>
						{certList}
						{options.map((item) => (
							<li 
								className='autocompli' 
								onClick={() => onSelect(item)}
								style={{ 
									cursor:'pointer', borderRadius:'12px', margin:3, padding: 5, 
									 border:'0.3pt solid #c8c8b6'
								}}
							>
								{item.sname}
							</li>
						))}
					</ul>
				) : null
				
			}

		</div>
	]
}

const enhance = compose(
	withStateHandlers(({
		inState = {
			options: [],
			open: false
		}
    }) => ({
		options: inState.options,
		open: inState.open,
    }),{
		set_state: (state) => (obj) => {
			let _state = {...state}
			_.keys(obj).map( k => { _state[k] = obj[k] })
			return _state
		}
    }),
	withHandlers({
		getCertificates: ({ set_state }) => () => {
			authorize.ecpPostInit().then(res => {
				set_state({
					options: res.certs || [],
					open: true,
				})
			}).catch( err => {
				alert('No module CryptoPro')
			})
		},
		onSave: ({ set_state }) => () => {
			set_state({ open: false })
		},
		onSelect: ({ onChangeInput, config }) => (item) => {
			onChangeInput(item.thumbprint, config)
		}
	}),
	withHandlers({
		onOpen: ({ getCertificates }) => () => {
			getCertificates()
		}
	})
)

export default enhance(Certificate)
