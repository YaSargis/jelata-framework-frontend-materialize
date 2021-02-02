import React from 'react';
import { compose, withStateHandlers } from 'recompose';

import { Modal, Button, Carousel } from 'react-materialize';


import { api } from 'src/defaults';

const File_gallery = ({
	files = [], modal_open, set_state, title
}) => {
	const imgs = []
	files.forEach((item) => imgs.push(api._url + item.uri))
	
	if(_.isEmpty(files)){
		return null;
	} else return [
		<div style={{backgroundColor:'black', width:400}}>
			<Carousel
				
				carouselId={title}
				classname='gh'
				options={{
					fullWidth: false,
					indicators: true
				}}
				centerImages = {true}
				
			>
				{
					files.map(el => {
						return (
							<div style={{width:350}} key={JSON.stringify(el)}>
								<img 
									key={el.uri} 
									style={{width:350, cursor:'zoom-in'}} 
									src={api._url + el.uri}
									onClick={() => window.open(api._url + el.uri)}
								/>
							</div>
						)
					})
				}
			</Carousel>
		</div>

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
