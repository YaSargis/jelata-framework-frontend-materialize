import React from 'react';
// import { Pagination } from 'antd';
import FilterList from '../components/filter-list';
import { Col, Row, Button, Icon, Pagination } from 'react-materialize';
export const PegiNation = (
	allProps, location, listConfig, listColumns, arr_hide, basicConfig, filter,
	pagination, filters, showTotal, handlerPaginationPage, changePagination,
	getData, changeFilter, changeFilters, changeLoading, handlerGetTable, changeTS
) => {
	return (
		<Row>
			<Col s={11}>
				{allProps.pagination ? (
					<Pagination
						activePage = {pagination.pagenum || 1}
						items = {5}
						pageSizeOptions={['10', '20', '30', '40', '100']}
						pageSize={pagination.pagesize}
						maxButtons = {100}
						total={pagination.foundcount} showSizeChanger={allProps.ispagesize}
						showTotal={showTotal}
						onSelect={handlerPaginationPage} onShowSizeChange={handlerPaginationPage}
					/>
				) : null}
			</Col>
			<Col s={1}>
				<Button
					waves='light' className='blue'
					small floating style={{ float: 'right' }}
					icon={<Icon>settings_input_component</Icon>} onClick={() => changeFilter(!filter)}
				>
					
				</Button>
				<FilterList
					getData={getData} allProps={allProps} path={location.pathname}
					filter={filter} changeFilter={changeFilter} filters={filters}
					changeFilters={changeFilters} listConfig={listConfig}
					listColumns={listColumns} changeLoading={changeLoading}
					arr_hide={arr_hide} handlerGetTable={handlerGetTable}
					changeTS={changeTS} basicConfig={basicConfig}
					pagination = {pagination} changePagination = {changePagination}
				/>
			</Col>
		</Row>
	)
}
