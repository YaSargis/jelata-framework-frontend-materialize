import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { store } from 'src/redux/configStore';
import App from 'src/pages/app/index.jsx';

import "antd/dist/antd.min.css";
import 'src/styles/index.scss';

import {ConfigProvider} from 'antd'
import ruRu from 'antd/lib/locale-provider/ru_RU';
import 'moment/locale/ru';

ReactDOM.render(
	<Provider store={store}>
		<ConfigProvider locale={ruRu}>
			<BrowserRouter>
				<Route component={App}/>
			</BrowserRouter>
		</ConfigProvider>
	</Provider>,
  document.getElementById('container')
);

if(module && module.hot) module.hot.accept()
