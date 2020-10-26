import React from 'react';
import FileGallery from 'src/components/file_gallery';
import ActionsBlock from 'src/pages/layout/actions';
import { Collapse } from 'antd';

const { Panel } = Collapse;

export const listDataGenerate = (
    listData, listConfig, listActions, filters, origin, history, location, checked,
    getData, get_params, changeChecked, changeLoading
) => {
	const rows = []
	listData.forEach((item, ind) => {
		let newItem = {};
		Object.keys(item).forEach(k => {
			let config = listConfig.filter(conf => conf.key === k)[0];
			let value = item[k];
			const colorRow = (args, config) => {
				/*  function for type colorrow /painting row in seleted color */
				let colorrowtitle;
				if (config.filter(x => x.type === 'colorrow').length > 0)
					colorrowtitle = config.filter(x => x.type === 'colorrow')[0].key;
				return args[colorrowtitle];
			};

			if (config && config.visible) {
				if (config.type === 'image' || config.type === 'images' || config.type === 'gallery') {
					newItem[k] = <FileGallery files={value || []} />;
				} else if (
					config.type === 'file' ||
					config.type === 'files' ||
					config.type === 'filelist'
				) {
					newItem[k] = (
						<ul>
							{(value || []).map(x => (
								<li key={x.uri}>
									<div>
										<div>{x.filename}</div>
										<div>
											<a target='_blank' rel='noopener noreferrer' href={x.uri}>
												download
											</a>
										</div>
									</div>
								</li>
							))}
						</ul>
					);
				} else if (config.type === 'link') {
					newItem[k] = (
					  <div>
						{typeof value !== 'object' ? (
						  <a href={value} target='_blank' rel='noopener noreferrer'>
						  {' '}
						  {value}
						  </a>
						) : (
						  <a href={(value || { link: '' }).link}
							   target={(value || {target:null}).target || '_blank'} rel='noopener noreferrer'>
							{(value || { title: '' }).title}
						  </a>
						)}
					  </div>
					);
				} else if (config.type === 'color' || config.type === 'colorpicker') {
					newItem[k] = <div style={{ width: 20, height: 20, backgroundColor: value }} />;
				} else if (config.type === 'select' || config.type === 'typehead') {
					if (
					  config.relation && config.relationcolums &&
					  config.relationcolums.length > 0 &&
					  config.relationcolums.filter((rlt) => rlt.value !== 'id').length>0 &&
					  config.relationcolums.filter((rlt) => rlt.value !== 'id')[0].value
					) {
						let sel_col = config.relationcolums.filter((rlt) => rlt.value !== 'id')[0].value
						let sel_key = (listConfig.filter((lc_) => lc_.col === sel_col && lc_.table === config.relation)[0]||{}).key
						value = item[sel_key]
						newItem[k] = (
							<div style={{ color: colorRow(item, listConfig) }}>
								{value !== undefined && value !== null ? (
									typeof value === 'object' ? (
										<span>{JSON.stringify(value)}</span>
									) : (
										value.toString().split('\n').map((it, key) => {
										return (
											<span key={key}>{it}<br /></span>
										);
									}))
								) : (
									''
								)}
							</div>
						)
					} else {
						newItem[k] = (
							<div style={{ color: colorRow(item, listConfig) }}>
								{value !== undefined && value !== null ? (
									typeof value === 'object' ? (
										<span>{JSON.stringify(value)}</span>
									) : (
									value.toString().split('\n').map((it, key) => {
										return (
											<span key={key}>{it}<br /></span>
										);
									}))
								) : ('')}
							</div>
						)
					}
				} else if (config.type === 'array') {
					newItem[k] = (
						<div>
							{value.length > 0 ? (
								<Collapse defaultActiveKey={['1']}>
									<Panel header={config.title} key='1'>
										<table>
											<thead>
												<tr>
													{Object.keys(value[0] || {}).map(i => {
														return <th key={i}>{i}</th>;
													})}
												</tr>
											</thead>
											<tbody>
												{value.map(it => {
													return (
														<tr key={JSON.stringify(it)}>
															{Object.keys(it).map(i => {
																return <td key={i}>{it[i]}</td>;
															})}
														</tr>
													);
												})}
											</tbody>
										</table>
									</Panel>
								</Collapse>
							) : (
								<div />
							)}
						</div>
					);
				}
				else if (config.type === 'checkbox') {
					newItem[k] = (
						<div>
							<input type='checkbox' disabled checked={value} />
						</div>
					);
				}
				else if (config.type === 'innerHtml') {
					newItem[k] = (
						<div>
							<div dangerouslySetInnerHTML={{__html:value}} />
						</div>
					);
				}
				else {
					newItem[k] = (
						<div style={{ color: colorRow(item, listConfig) }}>
							{value !== undefined && value !== null ? (
								typeof value === 'object' ? (
									<span>{JSON.stringify(value)}</span>
								) : (
									value.toString().split('\n').map((it, key) => {
										return (
											<span key={key}> {it}
												<br />
											</span>
										);
									})
								)
							) : (
							  ''
							)}
						</div>
					);
				}
			}
		});
		let paramS = get_params();
		newItem['__actions__'] = (
			<ActionsBlock
			  actions={listActions || []} origin={origin || {}}
			  data={item || {}} params={paramS}
			  history={history} location={location}
			  getData={() => getData(getData, filters)}
			  type='table' checked={checked} setLoading = {changeLoading}
			/>
		);
		newItem['id'] = ind;
		const isCheckedRow = (item) => {
			let id_key = listConfig.filter((conf) => conf.col.toLowerCase() === 'id' && !conf.related)[0].key
			if (checked.filter((ch) => item[id_key] === ch).length>0) {
				return true
			}
			return false
		}
		newItem['__checker__'] = (
			<div>
			  <input
				checked={isCheckedRow(item)}
				onChange={(e) => {
					let id_key = listConfig.filter((conf) => conf.col.toLowerCase() === 'id' && !conf.related)[0].key
					let Id = item[id_key]
					let chckd = checked
					if (e.target.checked) {
						chckd.push(Id)
					} else {
						chckd = chckd.filter((ch) => ch !== Id)
					}
					changeChecked(chckd)
				}}
				type='checkbox' />
			</div>
		)

		rows.push(newItem);
	});
	return rows;
}
