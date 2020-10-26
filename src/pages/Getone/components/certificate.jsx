import React from 'react';
import { compose, lifecycle, withStateHandlers, withHandlers } from 'recompose';
import { Button, Modal, List, Typography, Popconfirm, Icon, notification } from 'antd';

const Certificate = ({
	data, config, open = false, options = [],
	set_state, onSave, onOpen, onSelect
}) => {
	let value = data[config.key];
	return [
		<Button onClick={onOpen} key='c1'>
			Сhoose certificate
		</Button>,
		<Modal
			key='c2'
			title='Choose the certificate'
			visible={open}
			onOk={onSave}
			onCancel={() => set_state({ open: false })}
		>
			<List
				header={<h4>Certificates list</h4>}
				size='small'
				dataSource={options}
				renderItem={item => (
					value === item.thumbprint ?
						<List.Item>
							<Typography.Text>
								{item.sname}
							</Typography.Text>
							<Icon 
								style={{
									right: '0',
									position: 'absolute'
								}} 
								type="check-circle" />
						</List.Item>
					: 
						<Popconfirm
							placement="top"
							title={'Confirm'}
							onConfirm={() => onSelect(item) }
							okText="Yes"
							cancelText="Close"
						>
							<List.Item className='list-item-certificate'>
								<Typography.Text>
									{item.sname}
								</Typography.Text>
							</List.Item>
						</Popconfirm>
				)}
			/>
		</Modal>
	];
};

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
			let _state = {...state};
			_.keys(obj).map( k => { _state[k] = obj[k] })
			return _state;
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
				notification.error({
					message: 'Error',
					description: err.status || 'Can not found module'
				});
			})
		},
		onSave: ({ set_state }) => () => {
			set_state({ open: false });
		},
		onSelect: ({ onChangeInput, config }) => (item) => {
			onChangeInput(item.thumbprint, config);
		}
	}),
	withHandlers({
		onOpen: ({ getCertificates }) => () => {
			getCertificates()
		}
	})
);

export default enhance(Certificate);
