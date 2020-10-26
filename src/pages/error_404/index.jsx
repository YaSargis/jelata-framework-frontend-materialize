import React from 'react';
import { Result, Button } from 'antd';

const Error_404 = ({history, location}) => {
	return (
		<Result
			status='404'
			title='404: Not found'
			subTitle={`${location.pathname + location.search + location.hash}`}
			extra={<Button type="primary" onClick={() => history.goBack()} >Go Back</Button>}
		/>
	)
};

export default Error_404;
