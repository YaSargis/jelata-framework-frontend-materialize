import {compose, withHandlers, lifecycle, withStateHandlers} from 'recompose';
import { apishka } from "src/libs/api";
import qs from 'query-string';

const enhance = compose(
	withStateHandlers(({
		inState = {
			startDate: {}, endDate: {}, title: {},
			data: [], params: { input: {}},
			origin: {}, acts: [], onlyDayDate: {}
		}
    }) => ({
		startDate: inState.startDate, endDate: inState.endDate,
		title: inState.title, data: inState.data,
		params: inState.params, origin: inState.origin, acts: inState.acts,
		onlyDayDate: inState.onlyDayDate
    }), {
		set_state: (state) => (obj) => { 
			let _state = {...state}, keys = _.keys(obj); 
			keys.map( k => { _state[k] = obj[k] }); 
			return _state; 
		},
		changeParams: (state) => (obj) => ({
			...state,
			params: obj
		})
	}),
	withHandlers({
		get_params: (props) => (_props) => {
			let params = {},
				_p = _props || props; // _props = nextProps or prevProps
			if(props.compo) {
				params.inputs  = qs.parse(_p.location.search);
				params.search  = _p.location.search;
				params.path    = _p.path;
				params.id_page = _p.path;
			} else {
				params.inputs  = qs.parse(_p.location.search);
				params.search  = _p.location.search;
				params.path    = _p.match;
				params.id_page = _p.match.params.id_page; // id_page приходит из React-router
			};
			return {...params};
		},
		getData: ( { set_state, params, match } ) => () => {
			apishka('POST', {inputs: params.input}, '/schema/list?path=' + match.params.id, (res) => {
				const filteredStartDate = res.config.find(item => item.type === 'calendarStartDate');
				const filteredEndDate = res.config.find(item => item.type === 'calendarEndDate');
				const filteredTitle = res.config.find(item => item.type === 'calendarTitle');
				const filteredCurrentDay = res.config.find(item => item.type === 'date')

				set_state({
					startDate: filteredStartDate, endDate: filteredEndDate,
					title: filteredTitle, data: res.data, origin: res,
					acts: res.acts, onlyDayDate: filteredCurrentDay
				})
			})
		}
	}),
	lifecycle({
		componentWillMount() {
			const { params, changeParams, match, location } = this.props;
			params.inputs = qs.parse(location.search);
			params.search = location.search;
			params.path = match.params.match;

			changeParams({
				...params
			});
		},
		componentDidMount() {
			const { getData } = this.props;

			getData();      
		}
	})
);

export default enhance;