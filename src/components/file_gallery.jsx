import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import { Row, Col, Button, Carousel, Modal, Icon } from 'antd';

import {Configer} from 'src/libs/methods';

import { api } from 'src/defaults';

const File_gallery = ({
	files = [], modal_open, set_state,
}) => {
	if(_.isEmpty(files)){
		return null;
	} else return [
		<img key='s1' width={150} src={api._url + files[0].uri} onClick={() => {
			if (files[0].href)
				window.location.replace(files[0].href)
			else
				set_state({ modal_open: true });
		}}/>,
		<Modal key='s2' width={400} title='Show' visible={modal_open} onCancel={() => set_state({ modal_open: false })} footer={null}>
			<Carousel
				dotPosition='top'
			>
				{
					files.map(el => {
						return (
							<div key={JSON.stringify(el)}>
								<img key='s1' width={350} src={api._url + el.uri}/>
							</div>
						)
					})
				}
			</Carousel>
		</Modal>
	];
};

const enhance = compose(
	withStateHandlers(({
		inState = {
			modal_open: false
		}
	}) => ({
		modal_open: inState.modal_open
	}),{
		set_state: (state) => (obj) => {
			let _state = {...state};
				_.keys(obj).map( k => { _state[k] = obj[k] })
			return _state;
		},
	}),
);

export default enhance(File_gallery);
