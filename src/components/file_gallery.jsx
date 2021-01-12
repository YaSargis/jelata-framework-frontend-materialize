import React from 'react';
import { compose, withStateHandlers } from 'recompose';

import { Modal, Button, Slider, Slide, Caption } from 'react-materialize';


import { api } from 'src/defaults';

const File_gallery = ({
	files = [], modal_open, set_state,
}) => {
	/*const imgs = []
	files.forEach((item) => imgs.push(api._url + item.uri))*/
	
	if(_.isEmpty(files)){
		return null;
	} else return [
		<img key='s1' width={150} src={api._url + files[0].uri} onClick={() => {
			if (files[0].href)
				window.location.replace(files[0].href)
			else
				set_state({ modal_open: true });
		}}/>,
		<Modal
			
			actions={[
				<Button 
					onClick = {() => set_state({ modal_open: false })}
					flat modal='close' 
					node='button' 
					waves='green'
				>
					Close
				</Button>
			]}
			key={JSON.stringify(files)} 
			header={files[0].filename} 
			open={modal_open} 
			id={JSON.stringify(files)} 
			onBlur={() => set_state({ modal_open: false })}
		>
			<Slider options={{height:800}}>
			{
				files.map(el => {
					return (
						<Slide  >
							<img key='s1' width={350} src={api._url + el.uri}/>
						</Slide>

					)
				})
			}
			</Slider>
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

/*
				{
					files.map(el => {
						return (
							<div key={JSON.stringify(el)}>
								<img key='s1' width={350} src={api._url + el.uri}/>
							</div>
						)
					})
				}
*/
