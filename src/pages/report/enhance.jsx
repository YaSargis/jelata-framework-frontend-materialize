import { compose, withState,withHandlers, lifecycle } from 'recompose';
import { apishka } from 'src/libs/api';

const enhance = compose(
	withState('values', 'changeValues', {}),
	withState('params', 'changeParams', []),
	withState('inputs', 'changeInputs', {}),
	withState('selections', 'changeSelections', []), // helper { ptitle: {} | [] } - для селекта []
	withHandlers({
		getData: ({ match, changeValues, changeParams }) => () => {
			apishka(
				'GET', {}, '/api/report?id='+match.params.id,
				(res) => {
					document.title = res.outjson.title;
					changeValues({...res.outjson});
					changeParams([...res.outjson.params]);
				},
				(err) => {}
			)
		},
		getSelectOptions: ({ changeSelections, selections }) => (ptitle, substr, api_id) => {
			apishka(
				'GET', {}, '/api/methodinfo?id='+api_id,
				(res) => {
					const dataTypeString = res.data.outjson.methotypename;
					if(dataTypeString === "get") {
						apishka(
							'GET', {}, `/api/${res.data.outjson.methodname}`,
							(res) => {
								let sel = selections;
								sel[ptitle] = res.outjson;
								changeSelections(sel);
							}, (err) => {}
						)
					} else {
						Error('Methotypename of data are not GET request');
					}
				},
				(err) => {}
			)
		},
		getReportFile: ({ inputs, values }) => () => {
			let params = '?';
			Object.keys(inputs).forEach((x) => {
				let inp = typeof(inputs[x]) === 'object'? JSON.stringify(inputs[x]) : inputs[x];
				params += x +'=' + inp + '&';
			});
			params += 'filename=' + values.filename + '&template=..' + values.template_path;
			console.log('open report', '/rep/'+ values.path + params );
			window.open('/rep/'+ values.path + params);
		}
	}),
	lifecycle({
		componentDidMount() {
			const { getData } = this.props;
			getData();
		},
		componentDidUpdate(prevProps) {
			const { selections } = this.props;
			if (selections !== prevProps.selections) {
				// console.log('this is selection:',selections)
			}
		}
	})
);

export default enhance;
