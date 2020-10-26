import React from 'react';
import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose';
import qs from 'query-string';
import Select from 'react-select';

import { apishka } from 'src/libs/api';

const SelectBox = ({ onChange, onChangeInput, data = {}, inputs, config, options = [], onFocus, onFocusApi }) => {
    let filtOptions = [];
    data[config.key] ? _.isArray(data[config.key]) ? data[config.key].forEach((item) => {
        options.forEach((it) => {
            if(it.value === item) filtOptions.push(it)
        })
    }) : null : null;

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

    return <Select
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
        })}}
        menuPortalTarget={document.body}
        menuPlacement='auto'
        placeholder={'Choose from the list'}
        isMulti
        isClearable
        isDisabled={config.read_only || false}
        value={ filtOptions }
        options={options}
        onKeyDown={handleKeyDown}
        onFocus={() => {
            (config.type === 'multiselect_api') ? onFocusApi(config, inputs) : onFocus('');
        }}
        onChange={(...args) => {
            switch(args[1].action) {
                case 'select-option':
                    if(data[config.key]) {
                        data[config.key].push(args[1].option.value);
                    } else {
                        data[config.key] = [args[1].option.value];
                    }
                    break;
                case 'pop-value':
                case 'remove-value':
                    data[config.key] = _.filter(data[config.key], x => x !== args[1].removedValue.value);
                    break;
                case 'clear': {
                     data[config.key] = [];
                }
            };
            onChangeInput(data[config.key], config);
        }}
    />
};

const enhance = compose(
    withStateHandlers(
        ({
            inState = {
                options: [],
            }
        }) => ({
            options: inState.options,
        }),
        {
            set_state: (state) => (obj) => {
                let _state = {...state};
                _.keys(obj).map( k => { _state[k] = obj[k] })
                return _state;
            }
        }
    ),
    withHandlers({
        onFocusApi: ({ data, set_state, globalConfig }) => ( config,    inputs) => {
            apishka(
                'POST', {
                    data: data, inputs:inputs,
                    config: globalConfig
                },    config.select_api,
                (res) => {
                    let dat = _.sortBy(res.outjson, ['value']);
                    set_state({
                        options: dat,
                    });
                }, (err) => {}
            );
        },
        onFocus: ({ data, location, set_state, config }) => (substr, id) => {
            getDataSelect();
            function getDataSelect () {
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
                            } else {
                                inputs[obj.col.value] = obj.const;
                            }
                        });
                    };

                    apishka(
                        'POST', {
                            inputs: inputs, config: config,
                            id: id, substr: substr
                        }, '/api/select',
                        (res) => {
                            let _data = _.sortBy(res.outjson, ['value']);
                            set_state({
                                options: _data
                            });
                        }, (err) => {}
                    );
                }
            };
        },
    }),
    withHandlers({
        onChange: ({ onChangeInput, data, config }) => (newValue) => {
            newValue? onChangeInput(newValue.value, config) : onChangeInput('', config)
        }
    }),
    lifecycle({
        componentDidMount() {
            const { config, options, data, onFocusApi, onFocus } = this.props;
            if(config.type === 'multiselect_api') onFocusApi(config, data[config.key]); else onFocus(null , data[config.key]);
        }
    })
)

export default enhance(SelectBox);
