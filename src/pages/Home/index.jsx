import React from 'react';
import enhance from './enhance';


const Home = ({ }) => {
	document.title= 'Home';
	location.href = localStorage.getItem('homepage') || '/composition/home'
	return (<div />)
}

export default enhance(Home);
