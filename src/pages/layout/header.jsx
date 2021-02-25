import React from 'react'
import _ from 'lodash'
import { compose, withHandlers, withState } from 'recompose'
import { menu_creator } from 'src/libs/methods'

const enhance = compose(
	withState('menu', 'changeMenu', []),
	withState('usermenu', 'changeUsermenu', []),
	withHandlers({
		menu_creator: menu_creator
	})
)

const MyHeader = props => {
	const { children, extra, title, subtitle, className } = props
	return (
		<div>
			{extra || null}
			{title ? (
				<h4 level={4} style={{ display: 'inline-block', marginRight: '10px' }}>
					{title}
				</h4>
			) : null}
			{subtitle ? <span className='ant-page-header-title-view-sub-title'>{subtitle}</span> : null}
			{children || null}
		</div>
	)
}

export default enhance(MyHeader)
