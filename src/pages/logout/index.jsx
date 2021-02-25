import React from 'react'
import { compose, withState, withHandlers, lifecycle } from 'recompose'

import { apishka } from 'src/libs/api'

const enhance = compose(
	lifecycle({
		componentWillMount() {
			apishka(
				'POST', {}, '/auth/logout',
				(res) => {
					localStorage.clear()
					window.location.replace('/')
				}, (err) => {}
			)
		}
	})
)

const Logout = () => {
	return <div></div>
}

export default enhance(Logout)
