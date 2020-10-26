import handleComposition, { initStore as initStoreComp } from '../composition';
import handleHelpers, { initStore as initStoreHelp } from '../helpers';
import handleLoader, { initStore as initStoreLoad } from '../loader';
import handlePage,  { initStore as initStorePage } from '../page';
import handleSettings, { initStore as initStoreSett } from '../settings';
import handleUser, { initStore as initStoreUser } from '../user';

import { SET_COMPOSITION_DATA } from '../../actions/composition';
import { SET_STATUS } from '../../actions/helpers';
import { SET_LOADED } from '../../actions/loader';
import { SET_GETONE } from '../../actions/page';
import { SET_SETTINGS } from '../../actions/settings';
import {
  GET_MENUAPP,
  SET_OPEN_KEYS,
  SET_LOGIN_STATUS,
  GET_FAVORITS_MENU,
  SET_COLLAPSE_STATUS,
} from '../../actions/user';

describe('тест редюсеров', () => {
  test('композиция', ()=> {
		const action = {
			type: SET_COMPOSITION_DATA,
			isLoading: false,
			data_form: {},
			data_comp: {}
		};

		expect(handleComposition(initStoreComp, action)).toEqual({
			...initStoreComp
		});
	});
	
	test('helpers', () => {
		const action = {
			type: SET_STATUS,
			payload: false
		};
		
		expect(handleHelpers(initStoreHelp, action)).toEqual({
			...initStoreHelp
		});
	});
	
	test('Loading', ()=>{
		const action = {
			type: SET_LOADED,
			status: false
		};

		expect(handleLoader(initStoreLoad, action)).toEqual({
			...initStoreLoad
		})
	});

	test('получаем Get One', () => {
		const action = {
			type: SET_GETONE,
			getone: {}
		};

		expect(handlePage(initStorePage, action)).toEqual({
			...initStorePage
		});
	});

	test('получаем данные для Viewlist, View', () =>{
		const action = {
			type: SET_SETTINGS
		};

		expect(handleSettings(initStoreSett, action)).toEqual({
			...initStoreSett
		});
	});

	test('получение данных меню', () => {
		const action = {
			type: GET_MENUAPP,
			custom_menu: [],
  		usermenu: [],
			user_detail: {},
			status: true
		};

		expect(handleUser(initStoreUser, action)).toEqual({
			...initStoreUser
		});	
	});

	test('получение избранного меню из LocalStorage', () => {
		const action = {
			type: GET_FAVORITS_MENU,
			payload: []
		};
	
		expect(handleUser(initStoreUser, action)).toEqual({
			...initStoreUser
		});
	});

	test('должен установить статус логина', () => {
		const action = {
			type: SET_LOGIN_STATUS,
			status: true
		};

		expect(handleUser(initStoreUser, action)).toEqual({
			...initStoreUser
		});
	});

	test('должен установить открытые ключи', () => {
		const action = {
			type: SET_OPEN_KEYS,
			keys: []
		};

		expect(handleUser(initStoreUser, action)).toEqual({
			...initStoreUser
		});
	});

	test('должен уменьшить или увеличить боковое меню', () => {
		const action = {
			type: SET_COLLAPSE_STATUS,
			status: false
		};

		expect(handleUser(initStoreUser, action)).toEqual({
			...initStoreUser
		});
	});
});