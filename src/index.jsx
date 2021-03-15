import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import { store } from 'src/redux/configStore'
import App from 'src/pages/app/index.jsx'
ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<Route component={App}/>
		</BrowserRouter>
	</Provider>,
	document.getElementById('container')
)

if (module && module.hot) module.hot.accept()
