import React from 'react';
import { Row, Col, Pagination, Button } from 'antd';
import FilterList from '../components/filter-list';

export const PegiNation = (
  allProps, location, listConfig, listColumns, arr_hide, basicConfig, filter,
  pagination, filters, showTotal, handlerPaginationPage, changePagination,
  getData, changeFilter, changeFilters, changeLoading, handlerGetTable, changeTS
) => {
  return (
    <Row>
      <Col span={20}>
        {allProps.pagination ? (
          <Pagination
            pageSizeOptions={['10', '20', '30', '40', '100']}
            current={pagination.pagenum} pageSize={pagination.pagesize}
            total={pagination.foundcount} showSizeChanger={allProps.ispagesize}
            size='small' showTotal={showTotal}
            onChange={handlerPaginationPage} onShowSizeChange={handlerPaginationPage}
          />
        ) : null}
      </Col>
      <Col span={4}>
        <Button
          type='dashed' style={{ float: 'right' }}
          icon='filter' onClick={() => changeFilter(!filter)}
        />
        <FilterList
          getData={getData} allProps={allProps} path={location.pathname}
          filter={filter} changeFilter={changeFilter} filters={filters}
          changeFilters={changeFilters} listConfig={listConfig}
          listColumns={listColumns} changeLoading={changeLoading}
          arr_hide={arr_hide} handlerGetTable={handlerGetTable}
          changeTS={changeTS} basicConfig={basicConfig}
          pagination = {pagination}	changePagination = {changePagination}
        />
      </Col>
    </Row>
  )
}
