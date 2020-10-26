import React from 'react';

import { Spin, Row, Layout, Icon, Menu } from 'antd';
const { SubMenu } = Menu;

// import MyHeader from 'src/pages/layout/header';

import List from 'src/pages/list';
import GetOne from 'src/pages/Getone';

import _ from 'lodash';
import Composition from 'src/pages/composition';
import ActionsBlock from 'src/pages/layout/actions';

import enhance from './enhance';
import Item from 'antd/lib/list/Item';

const Trees = ({
  history, location, getData, view, ready, openedKeys, menu,
  handlerOpenChange, handlerSelectMenu, values, params
}) => {
  function menuRender(arr, fnMenu) {
    return arr.map((menuItem, menuIndex) => {
      return menuItem.children ? (
        <SubMenu
          key={menuItem.key} data={menuItem} title={
            <span>
              <Icon type={menuItem.icon || ''} />
              <span>{menuItem.label || '--'}</span>
            </span>
          }
        >
          {fnMenu(menuItem.children, fnMenu)}
        </SubMenu>
      ): (
        <Menu.Item key={menuItem.key} data={menuItem}>
          <span>
            <Icon type={menuItem.icon || ''} />
            <span>{menuItem.label || '--'}</span>
          </span>
        </Menu.Item>
      )
    })
  }
  return [
    <Row
      key='s2' gutter={8}
      style={{ margin: '10px', background: 'inherit !inherit' }}
    >
      <Row>
        <ActionsBlock
			    actions={values.acts} origin={values} data={values.items}
			    params={params} history={history} location={location}
			    getData={getData}
			  />
      </Row>
      <Layout>
        <Row style={{ margin: '0 10px' }}>
          <Menu
            size='small' mode='horizontal' openKeys={openedKeys}
            onOpenChange={handlerOpenChange} onClick={handlerSelectMenu}
          >
            { menuRender(menu, menuRender) }
          </Menu>
        </Row>
        <Layout.Content>
          <Spin tip='Loading...' spinning={!ready}>
            {
              ready ? view.treeviewtype === 1 ?
                (() => {
                  switch(view.viewtype) {
                    case 'table':
                      return (
                        <Row style={{ margin: '0 10px' }}>
                          <List compo = {true} path = {view.path} history = {history} location={location} />
                        </Row>
                      );
                    case 'form full':
                    case 'form not mutable':
                      return (
                        <Row style={{ margin: '0 10px' }}>
                          <GetOne compo = {true} path = {view.path} history = {history} location={location} />
                        </Row>
                      )
                  }
                })()
              : view.treeviewtype === 2 ? (
                  <Composition
                    trees = {true} compo = {true} path = {view.path}
                    history = {history} location={location} />
                ) : null
              : null
            }
          </Spin>
        </Layout.Content>
      </Layout>
    </Row>
  ]
};

export default enhance(Trees);
