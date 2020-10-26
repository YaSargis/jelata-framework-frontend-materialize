import React from 'react';
import { Icon } from 'antd';

export const CustomArrowPrev = (props) => {
	const { onClick, className } = props;
    return <Icon type='left' onClick={onClick} className={className} />
};

export const CustomArrowNext = (props) => {
    const { onClick, className } = props;
    return <Icon type='right' onClick={onClick} className={className} />
};
