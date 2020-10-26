import React from 'react';
import { Spin, Empty } from 'antd';
import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose';
import qs from 'query-string';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';

import { PostMessage , apishka} from 'src/libs/api';

let timer = {};

const NoOptionsMessage = props => {
    const { selectProps } = props;
    const { loading } = selectProps;
    if(loading) {
        return (
            <components.NoOptionsMessage {...props}>
                <Spin tip={'...'}/>
            </components.NoOptionsMessage>
        )
    } else {
        return (
            <components.NoOptionsMessage {...props}>
                <Empty />
            </components.NoOptionsMessage>
        );
    }

};

const handleKeyDown = (evt)=>{
    switch(evt.key){
        case "Home": evt.preventDefault();
            if(evt.shiftKey) evt.target.selectionStart = 0;
            else evt.target.setSelectionRange(0,0);
            break;
        case "End": evt.preventDefault();
            const len = evt.target.value.length;
            if(evt.shiftKey) evt.target.selectionEnd = len;
            else evt.target.setSelectionRange(len,len);
            break;
     }
};

const SelectBox = ({ name, onChange, onFocusApi, onFocus, data, inputs, config, options = [], loading, status }) => {
    let ind = _.findIndex(options, x => x.value === data[config.key]);
    if(!status && (data[config.key] !== null)) {
        return < Spin />
    } else {
        return (
            <AsyncSelect
                styles={{
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999
                    }),
                    dropdownIndicator: (base) => ({
                        ...base,
                        padding: 4
                    }),
                    clearIndicator: (base) => ({
                        ...base,
                        padding: 4
                    }),
                    control: (base) => ({
                        ...base,
                        minHeight: 0
                    }),
                    input: (base) => ({
                        ...base,
                        padding: 0
                    }),
                    valueContainer: (base) => ({
                        ...base,
                        padding: "0 8px",
                        color: '#000000'
                    }),
					placeholder: (base)=>({
						...base,
						color: '#cdbfc7'
					}),
				}}
                menuPlacement='auto'
                menuPortalTarget={document.body}
                loading={loading}
                components={{ NoOptionsMessage, LoadingMessage: () => <div style={{textAlign: 'center'}}><Spin tip='Загрузка данных' /></div> }}
                isClearable
                placeholder={'Введите для поиска'}
                cacheOptions
                isDisabled={config.read_only || false}
                value={options[ind] || null}
                defaultOptions={options}
                loadOptions={(substr) => {
                    return (config.type === 'typehead_api') ? onFocusApi(substr) : onFocus(substr);
                }}
                onFocus={() => {
                    (config.type === 'typehead_api') ? onFocusApi(null, data[config.key], inputs) : onFocus(null, data[config.key]);
                }}
                onChange={onChange}
                onKeyDown={handleKeyDown}
			/>
		)
	}
};
// ------------------------- // ------------------------- // ------------------------- // -------------------------
const enhance = compose(
    withStateHandlers(({
        inState = {
            options: {}, loading: false, status: false
        }
    }) => ({
        options: inState.options, loading: inState.loading, status: inState.starus
    }), {
        set_state: (state) => (obj) => {
            let _state = {...state};
                _.keys(obj).map( k => { _state[k] = obj[k] })
                return _state;
            }
    }),
    withHandlers({
        onFocusApi: ({ data, set_state, globalConfig, name, config }) => (substr, id, inputs) => {
            set_state({
                loading: true
            });
            timer[name] ? clearTimeout(timer[name]) : null;
            const getDataSelect = new Promise ((resolve, reject) => {
                timer[name] = setTimeout( () => {
                    apishka(
                        'POST', {
                            data: data, inputs: inputs, config: globalConfig
                        }, config.select_api+'?substr='+(id || substr),
                        (res) => {
                            let dat = _.sortBy(res.outjson, ['value']);
                            resolve(dat);
                        }, (err) => { }
                    );

                }, substr ? 2000 : 1);
            });

            return getDataSelect.then( res => {
                if(substr) {
                    set_state({
                        loading: false, options: res
                    });
                    return res;
                } else {
                    set_state({
                        options: res, loading: false, status: true
                    });
                };
            });

        },
        onFocus: ({ data, location, set_state, config }) => (substr, id) => {

            const getDataSelect = new Promise ((resolve, reject) => {
                timer[name] = setTimeout( () => {
                    let inputs = qs.parse(location.search);
                    if (!config.selectdata){
                        if (config.select_condition) {
                            config.select_condition.forEach((obj) => {
                                let value = null
                                if (obj.value) {
                                    if (data[obj.value.key]) {
                                        value = data[obj.value.key];
                                        inputs[obj.value.value] = value;
                                    }
                                } else inputs[obj.col.value] = obj.const;
                            });
                        };
                        apishka( 'POST',
							{
                                inputs: inputs, config: config,
                                val: substr, id: id, ismulti: null
                            }, '/api/select',
                            (res) => {
                                let _data = _.sortBy(res.outjson, ['value']);
                                resolve(_data);
                            },
                            (err) => {}
                        );
                    }
                }, substr ? 1000 : 1);
            });

            return getDataSelect.then( res => {
                if(substr) {
                    set_state({
                        options: res
                    });
                    return res;
                } else {
                    set_state({
                        options: res,
                        status: true
                    });
                };
            });
        },
    }),
    withHandlers({
        onChange: ({ onChangeInput, data, config }) => (newValue) => {
            newValue === null ? onChangeInput('', config) : onChangeInput(newValue.value, config)
        }
    }),
    lifecycle({
        componentDidMount() {
            const { config, options, data, onFocusApi, onFocus } = this.props;
            //if(_.isEmpty(options) && data[config.key]) {
                if(config.type === 'typehead_api') onFocusApi(null, data[config.key]); else onFocus(null, data[config.key]);
            // }
        },
        componentDidUpdate(prevProps) {
            const {config, options, data, onFocusApi, onFocus } = this.props;
            if(data !== prevProps.data) {
                if(data[config.key] !== prevProps.data[config.key]) {
                    if(config.type === 'typehead_api') onFocusApi(null, data[config.key]); else onFocus(null, data[config.key]);
                }
            }
        }
    })
)

export default enhance(SelectBox);
