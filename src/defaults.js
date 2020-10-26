import * as c from './public/config.json';

const isDev = process.env.NODE_ENV === 'development';

export const config = c.default;
export const api = isDev
  ? {
		_url: 'http://127.0.0.1:8080'
    }
	: c.api;

export const actions = [
	{ value: '=', label: '=', js: '===', python: '==' },
	{ value: '<>', label: '!=', js: '!==', python: '!=' },
	{ value: '>', label: '>', js: '>', python: '>' },
	{ value: '<', label: '<', js: '<', python: '<' },
	{ value: '>=', label: '>=', js: '>=', python: '>=' },
	{ value: '<=', label: '<=', js: '<=', python: '<=' },
	{ value: 'like', label: 'like', js: 'indexOf', python: 'find' },
	{ value: 'in', label: 'in', js: '', python: 'in' },
	{ value: 'not in', label: 'not in', js: '', python: 'in' },
	{ value: 'is null', label: 'is null', js: '===null', python: 'is None' },
	{ value: 'is not null', label: 'is not null', js: '!==null', python: 'is not None' },
	{ value: 'likeOr', label: 'likeOr', js: 'likeOr', python: 'find' },
	{ value: 'contain', label: 'contain', js: 'contain', python: 'find' }
];

export const api_methods = [
	{ label: 'GET', value: 'GET' },
	{ label: 'POST', value: 'POST' },
	{ label: 'DELETE', value: 'DELETE' },
	{ label: 'PUT', value: 'PUT' }
];

export const bools = [
	{ value: 'and', label: 'and' },
	{ value: 'or', label: 'or' }
];
