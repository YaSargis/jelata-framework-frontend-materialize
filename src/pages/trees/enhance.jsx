import { compose, withState, withHandlers, lifecycle } from 'recompose';
import qs from 'query-string';

import { apishka } from 'src/libs/api';

// import { Configer } from 'src/libs/methods';

const enhance = compose(
	withState('values', 'changeValues', {}),
	withState('menu', 'changeMenu', []),
	withState('openedKeys', 'changeOpenedKeys', []),
	withState('rootKeys', 'changeRootKeys', []),
	withState('view', 'changeView', {}),
	withState('params', 'changeParams', {
		inputs: {}
	}),
	withState('ready', 'changeReady', true),
	withHandlers({
		set_state: (state) => (obj) => {
			let _state = {...state},
				keys = _.keys(obj);
			keys.map( k => _state[k] = obj[k]);
			return _state;
		}
	}),
	withHandlers({
		handlerOpenChange: ({ openedKeys, rootKeys, changeOpenedKeys }) => (openKeys) => {
			const latestOpenKey = openKeys.find(key => openedKeys.indexOf(key) === -1);
			if (rootKeys.indexOf(latestOpenKey) === -1) changeOpenedKeys(openKeys); else changeOpenedKeys(latestOpenKey || []);
		}
	}),
	withHandlers({
		getData: ({
			history, location, match, changeView, changeValues,
			changeReady, changeMenu, changeRootKeys
		}) => () => {
			apishka(
				'GET', {}, '/api/treesbypath?path=' + match.params.id,
				(res) => {
					document.title = res.outjson.title;
					changeValues({...res.outjson});
					let { branches, items } = res.outjson;
					let rootKeys = [];
					let h = location.hash ? true : false;
					if(_.isArray(branches)) {
						if(!_.isEmpty(branches)) {
							branches.map((el, i) => {
								if(el.ismain === true && !h) {
									let _view = _.find(items, x => x.key === el.key) ;
									history.push(location.pathname + location.search + '#' + _view.key);
									if(_view.path && _view.treeviewtype > 0) changeView(_view);
								}
								el.children ? rootKeys.push(el.key) : null
							});
							changeMenu(branches);
							if(location.hash) {
								let _view = _.find(items, x => ('#' + x.key) === location.hash);
								if(_view.path && _view.treeviewtype > 0) changeView(_view);
							}
						}
					};
					changeRootKeys(rootKeys);
					changeReady(true);
				},
				(err) => {}
			)
		}
	}),
	withHandlers({
		handlerSelectMenu: ({ changeReady, changeView, history, values, location }) => (item) => {
			console.log('VALUES:ffffff  ', values )
			const searchByString = (obj, propString) => {
				// deep search in object
				if(!propString) return obj;
				var prop, props = propString.split(',');
				for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
					prop = props[i];
					var candidate = obj[prop];
					if(candidate) obj = candidate; else break;
				};
				return obj[props[i]];
			}		
			const _item = searchByString(item, 'item,props,data'),
				  _view = _.find(values.items, x => x.key === item.key) ;
			if ( location.hash !== ('#'+_view.key) ) {
				changeReady(false);
				history.push(location.pathname + location.search + '#' + _view.key);
				if(_view.path && _view.treeviewtype > 0) {
					changeView(_view );
				}
			}
		}
	}),
	lifecycle({
		componentDidMount() {
			let { getData, changeReady, params, changeParams, match, location } = this.props;
			params.inputs = qs.parse(location.search);
			params.path = match.params.match;
			params.search = location.search;
			changeParams({...params});
			changeReady(false);
			getData();
		},
		componentDidUpdate(prevProps) {
			
			if(prevProps.location.hash !== this.props.location.hash) {
				if(this.props.ready === false) this.props.changeReady(true)
			};
			if(prevProps.location.search !== this.props.location.search) {
				
				this.props.getData();
				this.props.changeReady(false);
			}
		}
	})
);

export default enhance;
