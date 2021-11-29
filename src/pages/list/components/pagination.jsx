import React from 'react'
// import { Pagination } from 'antd'
import FilterList from '../components/filterList'
import { Col, Row, Button, Icon } from 'react-materialize'
import Select from 'react-select'

export const PegiNation = (
	allProps, location, listConfig, listColumns, arr_hide, basicConfig, filter,
	pagination, filters, showTotal, handlerPaginationPage, changePagination,
	getData, changeFilter, changeFilters, changeLoading, handlerGetTable, changeTS, params
) => {
	return (
		<Row>
			<Col s={11}>
				{allProps.pagination ? (
					<Row>
						<Col s={1}>
							<Select
								styles={{
									menuPortal: (base) => ({
										...base,
										zIndex: 9999,
										
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
										padding: '0 8px',
										color: '#000000'
									}),
									placeholder: (base)=>({
										...base,
										color: '#cdbfc7'
									})
								}}
								options = {[ 
									{value: 10, label: '10'}, {value: 20, label: '20'}, {value: 30, label: '30'},
									{value: 40, label: '40'}, {value: 50, label: '50'}, {value: 100, label: '100'}
								]}
								value = {{value : pagination.pagesize, label: pagination.pagesize}}
								onChange={ (item) => handlerPaginationPage(pagination.pagenum, item.value) }

							/>
						</Col>
						<input 
							value={pagination.pagenum || 1} 
							style={{ 
								width:'65px', 
								height: '2rem', border: '1px #9e9e9e solid', 
								textAlign:'center', borderRadius: '5px', margin: '0 0 0 0'
							}} type='number' 
							onChange={(e) => handlerPaginationPage(e.target.value, pagination.pagesize)}
						/>
						<span style={{fontSize: '16px'}}> → {Math.round(pagination.foundcount/pagination.pagesize)}</span>  
					</Row>
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
					pagination = {pagination} changePagination = {changePagination} params={params}
				/>
			</Col>
		</Row>
	)
}

/*
					<Pagination
						activePage = {pagination.pagenum || 1}
						items = {pagination.foundcount/pagination.pagenum}
						pageSizeOptions={['10', '20', '30', '40', '100']}
						pageSize={pagination.pagesize}
						maxButtons = {10}
						total={pagination.foundcount} showSizeChanger={allProps.ispagesize}
						showTotal={showTotal}
						onSelect={handlerPaginationPage} onShowSizeChange={handlerPaginationPage}
					/>
*/