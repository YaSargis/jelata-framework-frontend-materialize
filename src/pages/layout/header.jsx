import React from 'react';
import _ from 'lodash';

import { Layout, Divider, Typography, Row } from 'antd';
import { compose, withHandlers, withState } from 'recompose';

const { Header } = Layout;
const { Title } = Typography;
import { menu_creator } from 'src/libs/methods';

const enhance = compose(
	withState('menu', 'changeMenu', []),
	withState('usermenu', 'changeUsermenu', []),
	withHandlers({
		menu_creator: menu_creator
	})
);

const MyHeader = props => {
	const { children, extra, title, subtitle, className } = props;
	return (
		<Header className={className || ''} style={{ background: '#fff', padding: 0 }}>
			<Row>
				<Divider style={{ margin: 0 }} />
				{extra || null}
				{title ? (
					<Title level={4} style={{ display: 'inline-block', marginRight: '10px' }}>
						{title}
					</Title>
				) : null}
				{subtitle ? <span className='ant-page-header-title-view-sub-title'>{subtitle}</span> : null}
				{children || null}
			</Row>
		</Header>
	);
};

export default enhance(MyHeader);
