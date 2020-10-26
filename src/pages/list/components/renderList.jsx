import React from 'react';

import {
  Col, Spin, Card
} from 'antd';
import ActionsBlock from 'src/pages/layout/actions';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { handlerGoLink, visibleCondition } from 'src/libs/methods';



export const renderBlock = ({
  origin, listData, params, history, location, getData, checked,
  changeLoading, pagin, loading, allProps, ready, rows, listConfig,
  listActions, columns2, expandRow, compo, keyTable
}) => {
  console.log('origin:', origin)
  return (
    <>
      {compo ? (
        <ActionsBlock
          key='sd1' actions={origin.acts}
          origin={origin} data={listData}
          params={params} history={history}
          location={location} getData={getData}
          checked={checked} setLoading = {changeLoading}
        />
      ) : null}
      {pagin}
      <div key='sd2' className='size_table'>
        <Spin spinning={loading} tip='loading...'>
          {allProps.viewtype === 'tiles' ? (
           <div
             className={
               !allProps.classname || allProps.classname === ''? 'fr_tiles'
               : allProps.classname
             }
           >
            {(ready ? rows : []).map((el, i) => {
              return (
                <Card key={'tile_' + i} className='tiles_el'>
                  <Col>
                    {listConfig.filter((cnf) => cnf.key !== 'rownum').map((conf, ind) => {
                      return conf.visible === true ? (
                        <div> {
                          (conf.key !== '__actions__')? (
                            <Col
                              span={conf.width || 12} key={'lfa_' + ind}
                              className={conf.classname}

                              onDoubleClick = {() => {
                                let action = _.find(listActions, x =>
                                  x.ismain === true &&
                                  visibleCondition(el, x.act_visible_condition, params.inputs)
                                );
                                if (action) {
                                  switch (action.type) {
                                    case 'Link':
                                      handlerGoLink(listData[i], action, listConfig, params.inputs, history);
                                      break;
                                  }
                                }
                              }}
                             >
                              <div>
                                <div><b>{conf.title + ': '}</b></div>
                                <div>{el[conf.key]}</div>
                              </div>
                             </Col>
                          )  : (
                             <Col
                               span={24} key={'lfa_' + ind}
                               style={{ borderBottom: '1px dashed #ececec' }}
                             >
                              <div className='tiles_actions'>{el[conf.key]}</div>
                             </Col>
                          )
                        }
                        </div>
                      ) : null;})}
                    </Col>
                  </Card>
                );})
            }
           </div>
          ) : (
            <React.Fragment key={keyTable}>
              <div style={{ overflowX: 'auto' }}>
                <BootstrapTable
                   classes={
                     !allProps.classname || allProps.classname === ''
                     ? 'tabtab list_table'
                     : allProps.classname
                   } // try to apply CSS class
                   keyField={'id'} data={rows} columns={columns2}
                   expandRow={(origin.acts.filter(x => x.type === 'Expand')[0])? expandRow:false }
                   noDataIndication={() => (
                     <label style={{ color: '#c1bbbb' }}>...empty...</label>
                   )}
                   cellEdit={cellEditFactory({ mode: 'click', blurToSave: true })}
                 />
                   <label
                     style={{ fontSize: '9px' }}>
                     count : {allProps.foundcount}
                   </label>
                 </div>
               </React.Fragment>
            )}
          </Spin>
        </div>
      </>
    );
}
