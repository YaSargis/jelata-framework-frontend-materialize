import React from 'react';
import { compose, withHandlers, lifecycle, withStateHandlers } from 'recompose';
import _ from 'lodash';

import { notification, Modal } from 'antd';
const confirm = Modal.confirm;

import qs from 'query-string';

import { apishka } from 'src/libs/api';

//import { toggleLoading } from 'src/redux/actions/helpers';

let wss = []; // ws array

const enhance = compose(
    withStateHandlers(({
        inState = {
			data: {}, origin: {}, id_title: null,
			carouselRef: React.createRef(), initIndex: 0,
			collapseAll: false, localChangeCollapse: false,
			localActiveKey: []
        }
    }) => ({
		data: inState.data, origin: inState.origin,
		id_title: inState.id_title, carouselRef: inState.carouselRef,
		initIndex: inState.initIndex, collapseAll: inState.collapseAll,
		localChangeCollapse: inState.localChangeCollapse,
		localActiveKey: inState.localActiveKey
    }),{
		set_state: state => obj => {
			let _state = { ...state };
			_.keys(obj).map(k => {
			    _state[k] = obj[k];
			});
			return _state;
		}
    }),
	withHandlers({
		get_params: props => _props => {
			let params = {},
				_p = _props || props; // _props = nextProps or prevProps
			if (props.compo) {
				params.inputs = qs.parse(_p.location.search);
				params.search = _p.location.search;
				params.path = _p.path; params.id_page = _p.path;
			} else {
				params.inputs = qs.parse(_p.location.search);
				params.search = _p.location.search;
				params.path = _p.match;
				params.id_page = _p.match.params.id_page; // id_page React-router
			}
		    return { ...params };
		},
		setLoading:({loading, set_state}) => (loadstatus) => {
			set_state({
				loading: loadstatus
			});
		},
		onChangeData: ({ set_state, data = {} }) => (event, item_config) => {
			let value = event,
				_data,
				valueTextTypes = event && event.target && event.target.value;
			if (event !== null) {
				value = event.target ? event.target.value : event;
			}

			if (event && event.target) {
				value === '' ? (value = null) : (value = value);
			}
			_data = { ...data };
			_data[item_config.key] = value;

			if (value === '' || valueTextTypes === '') {
				_data[item_config.key] = null;
			}

			set_state({
				data: { ..._data }
			});
		}
	}),
    withHandlers({
        getData: ({ get_params, origin, set_state, compo, setLoading }) => (id, getData) => {
            let params = get_params();

            if (id) {
                let id_title = _.filter(
                    origin.config,
                    o => o.col.toUpperCase() === 'ID' && !o.fn && !o.relatecolumn
                )[0].title;
                params.inputs[id_title] = id;
            }
            apishka(
                'POST', {inputs: params.inputs}, `/schema/getone?path=${params.id_page}`,
                (res) => {
				    if (!compo && !params.inputs._doctitle_)
					    document.title = res.title;
				    else if (params.inputs._doctitle_)
					    document.title = params.inputs._doctitle_;

                    let _r = res, s_parsed = qs.parse(location.search),
						             rel, rel_obj = {};
 					if (s_parsed.relation)
 				        rel = s_parsed.relation.split(',')

 					if (!s_parsed.relation && params.inputs.relation)
 					    rel = params.inputs.relation.split(',')

 				    if (!rel)
 					    rel = []

                    if (res.subscrible) {
                        let ws = document.location.href.split('//')[1];
						let ws_protocol = document.location.href.split('//')[0].indexOf('s') !== -1? 'wss' : 'ws'

                        ws = ws.split('/')[0];
						
                        ws = ws_protocol + '://' + ws + '/ws';
                        let socket = new WebSocket(ws);
                        wss.push(socket);

                        let idcol = (
                            res.config.filter(x => x.col.toUpperCase() === 'ID' && !x.related)[0] || {}
                        ).key;

                        socket.onopen = () => {
                            let ids = [];
                            res.data.forEach(x => ids.push(x[idcol]));

                            socket.send(JSON.stringify({ viewpath: params.id_page, ids: ids }));
                        };

                        socket.onclose = event => {
                            if (event.wasClean) {
                                console.log('clear closed (getOne)');
                            } else {
                                console.log('ws close failed');
                            }
                        };

                        socket.onmessage = e => {
                            let data = JSON.parse(e.data);
                            if (!data.error) {
                                data.forEach(x => {
                                    notification.success({
                                        message: x.notificationtext
                                    });

                                    apishka('POST', { id: x.id }, '/api/setsended')
                                    if (res.data[0])
                                        getData(res.data[0][idcol], getData);
                                });
                            } else {
                                console.log('ws message failed');
                            }
                        };
                        socket.onerror = error => {
                            notification.error({
                                message: 'ws error'
                            });
                            console.log('ws error:', error);
                        };
                    }
                    rel.forEach(x => {
                        rel_obj[x] = s_parsed[x]    || params.inputs[x];
                    });
                    let data = {};
                    data.viewid = _r.id;
                    data.tablename = _r.table;
					data.relation = s_parsed.relation || params.inputs.relation || null;
                    data.relationobj = rel_obj || {};

                    set_state({
                        data: { ...res.data[0] }, origin: { ...res },
                        global: { ...data }, loading: false
                    });
                    setLoading(false);
                },
                (err) => {setLoading(false);}

            )
        }
    }),
    withHandlers({
        onSaveRow: ({
            getData, onChangeData, set_state, data, origin,
            global = {}, compo, history, get_params
        }) => (
            value,
            item_config
        ) => {
            let id_title = _.filter(
                origin.config,
                o => o.col.toUpperCase() === 'ID' && !o.fn && !o.relatecolumn
            )[0].key;

            if (origin.viewtype === 'form not mutable') {
                onChangeData(value, item_config);
            } else if (origin.viewtype === 'form full') {
                // form full

                const go = () => new Promise((resolve, reject) => {
                    let _data = { ...global };

                    _data.tablename = origin.table;
                    data[id_title] ? (_data.id = data[id_title]) : null;
                    _data.config = { ...item_config };
                    _data.value = value;

                    if (!item_config.related) {
                        // _data.tablename = view_settings.tablename
                    } else {
                        _data.relatetable = _data.tablename;
                        _data.tablename = item_config.table;
                    }
                    resolve(_data);
                });

                go().then(_data => {
					apishka ('POST', _data, '/api/saverow', 
						(res) => {
							let res_data = res.outjson;
							if (!item_config.related) {
								if (!data[id_title] && !res_data || item_config.updatable) {
									if (!data[id_title]) {
										data[id_title] = res_data.id
									}
									getData(data[id_title] || res_data.id, getData);
								} else {
									if (res_data.id) {
										data[id_title] = res_data.id;
										data[item_config.key] = value;
									} else {
										data = res_data;
									}
									set_state({
										data: { ...data }
									});
								}
							} else {
								if (item_config.updatable) {
									getData(data[id_title] || res_data.id, getData);
								}
							}

							/* update compo if updatable */
							let params = get_params()
							let IdTitle = _.filter(
								origin.config,
								o => o.col.toUpperCase() === 'ID' && !o.fn && !o.relatecolumn
							)[0].title
							if (
								item_config.updatable && compo && (
									data[id_title] === params.inputs[IdTitle] ||
									data[id_title] === null ||
									data[id_title] === undefined
								)
							) {
								let search_updater = '___hashhhh___=0.11'
								if (location.search.indexOf('?') === -1)
									search_updater = '?' + search_updater
								else
									search_updater = '&' + search_updater
								history.push(location.pathname + location.search + search_updater + location.hash)
							}
							/* update compo if updatable */

							notification.success({
								message: 'OK', duration: 2
							});
						},
						(err) => {}
					)
				}).catch(err => {
					if (err)
						notification.error({
							message: 'Error',
							description: err.response ? err.response.data.message : 'Uncknown Error'
						});
				});
			}
		},
		onSubmitState: ({ set_state, data = {}, origin = {} }) => (event, item_config) => {
			let id_title = _.filter(
				origin.config,
				o => o.col.toUpperCase() === 'ID' && !o.fn && !o.relatecolumn
			)[0].title,
			keys = _.keys(origin.data[0]),
			_data = {};
			keys.map(k => {
				if (origin.data[0][k] !== data[k]) {
					_data[k] = data[k];
				}
			});
		}
	}),
	withHandlers({
		onChangeInput: ({ onSaveRow }) => (event, item) => {
			let value = event;
			if (event !== null && event !== undefined) {
				value = event.target ? event.target.value : event;
			}
			if (event === undefined || event === '') value = null;
				onSaveRow(value, item);
		},
		onRemoveImg: ({ data, onSaveRow }) => event => {
            // title - binding
            confirm({
                title: 'delete file?', content: '',
                onOk() {
                    let row = event.row,
                            row_data = data[row.key];

                    _.remove(row_data, o => o.uri === event.file_url); // deleting file

                    onSaveRow(row_data, row);
                },
                onCancel() {},
                okText: 'Yes',
                cancelText: 'No'
            });
            notification.info({
                message: 'Do not forget save changes'
            });
        },
        onRemoveFile: ({ data, onSaveRow }) => (files, uri, item) => {
            confirm({
                title: 'Delete file?', content: '',
                onOk() {
                    _.remove(files, o => o.uri === uri);
                    onSaveRow(files, item);
                },
                onCancel() {},
                okText: 'Yes',
                cancelText: 'No'
            });
            notification.info({
                message: 'Do not forget save changes'
            });
        },
        onUploadFileChange: ({ set_state, data, origin, onSaveRow }) => (event, item_config, multyple) => {
            if (event.target) {
                if (event.target.files.length > 0) {
                    let _data = new FormData(),
                        id_title = _.filter(
                            origin.config,
                            o => o.col.toUpperCase() === 'ID' && !o.fn && !o.relatecolumn
                        )[0].key;

                    for (let i in event.target.files) {
                        if (data[item_config.key]) {
                            _data.append('file_' + i, event.target.files[i]);
                        } else {
                            _data.append('file_' + i, event.target.files[i]);
                        }
                    }

                    _data.append('config', JSON.stringify(item_config));

                    if (data[id_title]) _data.append('id', data[id_title]);
                    if (data[item_config.key]) _data.append('value', JSON.stringify(data[item_config.key]));
                    if (!item_config.related) _data.append('tablename', origin.table || NaN);
                    else {
                        _data.append('tablename', item_config.tablename);
                        _data.append('relatetable', origin.table || NaN);
                    }
                    _data.append('viewid', origin.id);

                //    apishka ('POST', _data, '/api/savefile', (res) => {
					apishka ('POST', _data, '/upload_file', (res) => {
                            let res_data = res//.outjson;
                            /*if (res_data.id) {
                                data[id_title] = res_data.id;
                                data[item_config.key] = JSON.parse(res_data.value);
                            } else {
                                data[item_config.key] = res_data;
                            }*/
                            onSaveRow(res_data, item_config)

                            /*set_state({
                                data: { ...data }
                            });*/
                        },
                        (err) => {}
                    )
                }
            }
        },
        onUpload: ({ set_state, data, origin }) => (event, item_config, multyple) => {
            //handlerUploadFiles: ({ data, set_get_one, view_settings, config, changeUploaded }) => (event, item_config, multyple) => {
            let _data = new FormData(),
                id_title = _.filter(
                    origin.config,
                    o => o.col.toUpperCase() === 'ID' && !o.fn && !o.relatecolumn
                )[0].key;

            _data.append('file_0', event.file);
            _data.append('config', JSON.stringify(item_config));

            if (data[id_title]) _data.append('id', data[id_title]);
            if (data[item_config.key]) _data.append('value', JSON.stringify(data[item_config.key]));

            if (!item_config.related) _data.append('tablename', origin.table || NaN);
            else {
                _data.append('tablename', item_config.tablename);
                _data.append('relatetable', origin.table || NaN);
            }
            _data.append('viewid', origin.id);

             apishka('POST', _data, '/api/savefile', (res) => {
                let res_data = res.outjson;
                if (res_data.id) {
                    data[id_title] = res_data.id;
                    data[item_config.key] = JSON.parse(res_data.value);
                } else {
                    data = res_data;
                }
                set_state({
                    data: { ...data },
                    uploaded: multyple ? false : false
                });

            }, (err) => {})
        },

        onSave: ({ data, set_state, global, origin, getData, compo,    get_params, history, setLoading    }) => (callback = null) => {
            setLoading(true)
            let id_title = _.filter(
                origin.config,
                o => o.col.toUpperCase() === 'ID' && !o.fn && !o.relatecolumn
            )[0].key;
            apishka('POST', {
                data: data, viewid: global.viewid,
                id: data[id_title], relation: global.relation,
                relationobj: global.relationobj
            }, '/api/savestate', (res) => {
                let res_data = res.outjson;

				/* update compo if updatable */
				let params = get_params()
				let IdTitle = _.filter(
					origin.config,
					o => o.col.toUpperCase() === 'ID' && !o.fn && !o.relatecolumn
				)[0].title

				if (
					origin.config.filter((conf) => conf.updatable ).length > 0 &&
					compo && (
						data[id_title] == params.inputs[IdTitle] ||
						data[id_title] === null ||
						data[id_title] === undefined
					)
				) {
					let search_updater = '___hashhhh___=0.11'
					if (location.search.indexOf('?') === -1)
						search_updater = '?' + search_updater
					else
						search_updater = '&' + search_updater
					history.push(location.pathname + location.search + search_updater + location.hash)
				}
				/* update compo if updatable */

				if (res_data.id) {
					data[id_title] = res_data.id;
				}
				set_state({
					data: { ...data },
					loading: false
				});
				notification.success({
					message: 'Ok'
				});
				getData(data[id_title] || res_data.id, getData);
				if (callback && typeof(callback) === 'function') {
					callback()
				}
			}, (err) => {
                set_state({ loading: false });
            }
		)},
		handlerAutoComplete: ({ origin, set_state }) => (search_string, item) => {
			getDataSelect();
			function getDataSelect() {
				let inputs = {};
				apishka('POST', {
						val: search_string,
						table: origin.table,
						col: item.col
					}, '/api/autocomplete', (res) => {
						let newconfig = [...origin.config];
						newconfig.forEach((el, i) => {
							if (newconfig[i].key === item.key)
								newconfig[i]['selectdata'] = res.outjson;
						});
						origin.config = newconfig;
						set_state({
							origin: origin
						});
					}, (err) => {}
				)
			}
		},
		onChangeCollapse: ({ set_state }) => key => {
			set_state({
				localChangeCollapse: true,
				localActiveKey: key
			});
		}
	}),
lifecycle({
    componentDidMount() {
        this.props.getData(null, this.props.getData);
    },
    componentWillUnmount() {
        wss.forEach(ws_item => ws_item.close());
    },
    componentDidUpdate(prevProps) {
        const { btnCollapseAll, set_state } = this.props;
        if (prevProps.btnCollapseAll !== btnCollapseAll) {
            set_state({
                localChangeCollapse: false,
                collapseAll: btnCollapseAll
            });
        }
    },
    UNSAFE_componentWillUpdate(nextProps) {
        const { compo, getData, get_params } = this.props;
        let params = get_params(this.props),
            nextParams = get_params(nextProps);
        if (!compo) {
            // just data
            if (params.id_page !== nextParams.id_page) {
                getData();
            }
        } else {
            // Compo data
            const locationFirstLevel = nextProps.location.pathname.slice(0, 6);
            if (locationFirstLevel !== '/trees') {
                if (
                    nextProps.location.search !== this.props.location.search ||
                    nextProps.path !== this.props.path
                ) {
                    getData();
                }
            }
        }
    }
}));

export default enhance;
