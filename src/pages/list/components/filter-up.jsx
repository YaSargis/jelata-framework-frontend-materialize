import React from 'react';
import {compose, withHandlers, withState} from 'recompose';
import { apishka } from "src/libs/api";
import _ from 'lodash';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/ru_RU';
import {
		Drawer, Row, Col, Input, Divider, Button,
		List, Checkbox, Tooltip, Select, DatePicker ,
		Collapse, Icon
} from 'antd';
import {saveUserSettings} from 'src/libs/methods';

const { Panel } = Collapse;

const FilterListUp = ({
	filter, filters, allProps, getData, changeLoading,
	changeFilter, changeFilters, handlerFilters, handlerGetTable,
	handlerTriCheck, handlerColumnHider, apiData,
	indeterminate, listColumns, arr_hide, reduxUser, pagination, changePagination
}) => {

  return (
			<div>
	      <Row key='sawad2' gutter={4}>
					<Collapse
						bordered={false}
						defaultActiveKey={['up_filter']}
						expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
					>
				    <Panel header="" key='up_filter' >
	          {allProps.filters ? (
									Array.isArray(allProps.filters) &&
									allProps.filters.filter((x) => x.position == '2').length > 0
								) ? allProps.filters.filter((x) => x.position == '2').map((p, ixs)=> {
	              return ( <Row>
	                {(() => {
	                  switch (p.type) {
	                    case 'substr':
	                      return [
		                        <Col key='s44' span={24}><label >{p.title}</label></Col>,
		                        <Col key='s33' span={24}>
		                          <Input.Search placeholder={p.title || '...'}
			                            value={filters[p.column]}
																	size="small"
			                            onKeyUp={(event) => {
			                              if(event.keyCode === 13) {
				                                getData(getData); changeLoading(true);
				                                changeFilter(false);
			                              }
			                            }}
			                            onChange={(event) => handlerFilters(p.column, event.target.value) }
		                          />
		                        </Col>
	                      ];
	                      break;
	                    case 'date_between':
	                      return [
		                        <Col key='s1' span={24}><label >{p.title}</label></Col>,
		                        <Col key='s2' span={24}>
		                          <input placeholder={p.title || '...'}
			                            value={filters[p.column]} type='date'
																	className = 'ant-input'
			                            onChange={(event) => handlerFilters(p.column, event.target.value) }
		                          />
		                        </Col>
	                      ];
	                      break;
	                    case 'multijson':
	                    case 'select':
	                    case 'multiselect':
	                      let s_value;
	                      if(p.type === 'multijson' || p.type === 'multiselect'){
	                        //filters[p.column] &&
	                          //Array.isArray(filters[p.column]) ?
	                            s_value = filters[p.column]//.map((x, i_c)=> {x['key'] = i_c})
	                          || []
	                      } else s_value = filters[p.column];
	                      return [
	                        <Col key='s3' span={24}><label >{p.title}</label></Col>,
	                        <Col key='s4' span={24}>
		                          <Select
		                            labelInValue={(p.type === 'multijson' || p.type === 'multiselect')? true : false}
		                            mode={ (p.type === 'multijson' || p.type === 'multiselect') ? 'multiple' : 'default' }
		                            showSearch={true}
		                            value={filters[p.column]}
		                            placeholder={p.title}
		                            style={{ width: '100%' }}
		                            onFocus={()=>handlerGetTable(p)}
		                            onDeselect={(_val) => {
		                              if(p.type === 'multijson' || p.type === 'multiselect') {
		                                filters[p.column] = s_value.filter(o => o && o.key !== _val.key)
		                                handlerFilters(p.column, filters[p.column]);
		                              }
		                            }}
		                            onSelect={(_val, option) => {
		                              if(p.type === 'multijson' || p.type === 'multiselect') {
																		_val['value'] = _val.key
		                                if(Array.isArray(filters[p.column]))
		                                  filters[p.column].push(_val);
		                                  else filters[p.column] = [_val];
		                              } else filters[p.column] = _val;
		                              handlerFilters(p.column, filters[p.column]);
		                            }}
		                          >
		                            {
		                              apiData[p.title] ? Array.isArray(apiData[p.title]) ? (()=> {
		                                return apiData[p.title].map((it_m, i_arr) => {
		                                  return <Option key={i_arr} item={it_m} value={it_m.value}>{ it_m.label }</Option>
		                                })
		                              })() : null : null
		                            }
		                          </Select>
	                        </Col>
	                        ];
	                      break;
	                    case 'typehead':
	                      return [
	                        <Col key='s1' span={24}><label >{p.title}</label></Col>,
	                        <Col key='s2' span={24}>
	                          <Input.Search
		                            placeholder={p.title || '...'}
		                            value={filters[p.title]}
		                            onKeyUp={(event) => {
		                              if(event.keyCode === 13) {
		                                getData(getData); changeLoading(true);
		                                changeFilter(false);
		                              }
		                            }}
		                            onChange={(event) => handlerFilters(p.title, event.target.value) }
	                          />
	                        </Col>
	                      ]
	                      break;
	                    case 'period':
	                      let _dates = [],
	                          _format = 'YYYY-MM-DD';
	                      filters[p.column] ? filters[p.column].date1 ? _dates.push(moment(filters[p.column].date1, _format)) : null : null;
	                      filters[p.column] ? filters[p.column].date2 ? _dates.push(moment(filters[p.column].date2, _format)) : null : null;
	                      return [
	                        <Col key='s1' span={24}><label >{p.title}</label></Col>,
	                        <Col key='s2' span={24}>
	                          {/*
	                            value = [start date, end date];
	                          */}
	                          <DatePicker.RangePicker
		                            value={_dates}
		                            format={_format}
		                            onKeyUp={(event) => {
		                              if(event.keyCode === 13) {
		                                getData(getData); changeLoading(true);
		                                changeFilter(false);
		                              }
		                            }}
		                            locale={locale}
		                            onChange={(momentDates, dates) => {
		                              let v = {
		                                date1: dates[0],
		                                date2: dates[1],
		                              }
		                              handlerFilters(p.column, v)
		                            }}
	                          />
	                        </Col>
	                      ]
	                      break;
	                    case 'check':
	                      return [
	                        <Col key='s1' span={24}><label >{p.title}</label></Col>,
	                        <Col key='s2' span={24}>
	                          <Tooltip placement="topLeft" title={p.title || ''}>
	                            <Checkbox
		                              checked={filters[p.column] || null}
		                              indeterminate={indeterminate}
		                              onClick={()=>{
		                                handlerTriCheck(p.column, filters[p.column])
		                              }}
	                            >{p.title}</Checkbox>
	                          </Tooltip>
	                        </Col>
	                      ];
	                      break;
	                    default:
	                      return <Col>{p.type}</Col>
	                  }})()
	                }


	              </Row>
								)

	            }) : null : null
	          }
						<Row key='sawad3' gutter={4}>
							<Button type='link' icon='check' onClick={()=>{
								pagination.pagenum = 1
								changePagination(pagination)
								getData(getData);
								changeLoading(true);

								// changeFilter(false)
							}}>ok</Button>
							<Button type='link' style = {{color:'red'}} icon='close' onClick={()=>{
								filters = {};
								changeFilters(filters);
								changeLoading(true);
								// changeFilter(false)
								pagination.pagenum = 1
								changePagination(pagination)
								getData(getData, {});
							}}>clean</Button>
						</Row>
						</Panel>
					</Collapse>
	      </Row>
			</div>
		)
};

const enhance = compose(
	withState('indeterminate', 'changeInder', true),
	withState('apiData', 'changeApiData', {}),
	withHandlers({
    handlerColumnHider: ({ basicConfig, changeTS,  path }) => (ev, item) => {
			// userSettings from global

			let userSettings = JSON.parse(localStorage.getItem('usersettings')) || {}
			let viewsSettings = {}

			if (!userSettings['views']) { // if not views key
					userSettings['views'] = {}
			}

			if (userSettings['views'][path]) { // if not view in views object
					viewsSettings = userSettings['views'][path]
			}

      if (viewsSettings.hide) {
          let ind = _.findIndex(viewsSettings.hide, (x, i) => x === item.title);
          if(ind !== -1) viewsSettings.hide.splice(ind, 1); else viewsSettings.hide.push(item.title)
      } else {
          viewsSettings.hide = [item.title]
      }
			localStorage.setItem('usersettings', JSON.stringify(userSettings))
			userSettings['views'][path] = viewsSettings
			//reduxUser.user_detail.usersettings = userSettings
			saveUserSettings(userSettings)
      changeTS(userSettings['views']);
    },
		handlerFilters: ({filters, changeFilters}) => (column, value) => {
      filters[column] = value;
      changeFilters(filters);
    },
    handlerTriCheck: ({ filters, changeFilters, changeInder }) => (column, value) => {
      if(value==null) {
        changeInder(false);
        filters[column] = true;
        changeFilters(filters);
      }
      if(value === true) {
        filters[column] = false;
        changeFilters(filters);
      }
      if(value === false) {
        changeInder(true);
        filters[column] = null;
        changeFilters(filters);
      }
    },
    handlerGetTable: ({ listConfig, filters, apiData, changeApiData }) => (item) => {
	     apishka('GET', {}, '/api/gettable?id=' + item.id, (res) => {
					apiData[item.title] = res.outjson;
					changeApiData(apiData);
		   })
    },
	})
);

export default enhance(FilterListUp);
