import React from 'react';
import * as moment from 'moment';
import InputMask from 'react-input-mask';

import {

  Checkbox, Collapse,
  Carousel, Table,
  Input, DatePicker, Upload,
  Modal, Progress, Icon,
  Tooltip, AutoComplete, TimePicker,
  Button, List, Avatar, InputNumber, Rate
} from 'antd';

import { Col, Row, Card, Preloader, Collapsible, CollapsibleItem } from 'react-materialize';



import ColorPicker from './components/colorpicker';
import TextEditor from './components/text-editor';

//import locale from 'antd/es/date-picker/locale/ru_RU';
import { api } from 'src/defaults';

import ActionsBlock from 'src/pages/layout/actions';
import enhance from './enhance';

import Select from './components/select';
import MultiSelect from './components/multiselect';
import MultiDate from "./components/multidate";
import Typeahead from './components/typehead';
import MultiTypehead from './components/multitypehead';
import Certificate from './components/certificate';
import { CustomArrowNext, CustomArrowPrev } from './components/custom-arrows';
import AceEditor from 'react-ace';

import { visibleCondition /*Configer*/ } from 'src/libs/methods';
import TextArea from 'antd/lib/input/TextArea';


const keyCollapse = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15 >> c/4).toString(16))

const inputStyles = {border: '1px solid #9e9e9e', height: '2.5rem', paddingLeft: '8px', fontSize:'15px', borderRadius:'5px'}

const GetOne = ({
	location, history, set_state,
	get_params, onChangeInput, onChangeData,
	getData, onSave, carouselRef,
	initIndex, onChangeCollapse, onRemoveImg,
	onUpload, onUploadFileChange, uploaded = false,
	previewFile = false, collapseAll, localActiveKey,
	localChangeCollapse, compo = false, loading = true,
	data = {}, origin = {}, handlerAutoComplete, onRemoveFile,
	visibleModal = false, setLoading
}) => {
  let
    { config = {} } = origin,
    params = get_params(),
    render_childs = item => {
		data[item.key] = data.hasOwnProperty(item.key) ? data[item.key] : null;
		switch (item.type) {
			case 'label':
				if (data[item.key] instanceof Object) {
					return (
						<div key='1,1' label={item.title}><div><b>{item.title}</b></div>
							{JSON.stringify(data[item.key])}
						</div>
					);
				}
				return (
					<div key='1,1' label={item.title}><div><b>{item.title}</b></div>
						<span className='ant-form-text'>{' '}
							{!_.isNull(data[item.key])? (() => {
								switch (typeof data[item.key]) {
									case 'string':
										return data[item.key].split('\n').map((it, key) => {
											return (
												<span key={key}>{it}<br /></span>
											);
										});
									default:
										return data[item.key];
								}
							})()
							: ''}
							{' '}
						</span>
					</div>
				 );
				break;
			case 'text':
				return (
					<div key='1.2' label={item.title}><div><b>{item.title}</b></div>
						<input
							style={inputStyles}
							disabled={item.read_only || false}
							value={data[item.key] ? data[item.key] : ''}
							onChange={event => onChangeData(event, item)}
							onBlur={event => onChangeInput(event, item)}
						/>
					</div>
				);
				break;
			case 'textarea':
				return (
					<div key='d2.1' label={item.title}><div><b>{item.title}</b></div>
						<TextArea
							disabled={item.read_only || false}
							value={data[item.key] ? data[item.key] : ''}
							onChange={event => onChangeData(event, item)}
							onBlur={event => onChangeInput(event, item)}
						/>
					</div>
				);
				break;
			case 'date':
				return (
					<div key='d3' label={item.title}><div><b>{item.title}</b></div>
						<DatePicker
							disabled={item.read_only || false}
							value={data[item.key] ? moment(data[item.key], 'DD.MM.YYYY') : null}
							onChange={(f, ev) => onChangeInput(ev, item)}
							format='DD.MM.YYYY'
						/>
					</div>
				);
				break;
			case 'autocomplete':
				return (
					<div key='4.b' label={item.title}><div><b>{item.title}</b></div>
						<AutoComplete
							dataSource={
								item.selectdata? item.selectdata.map((it_ds, in_ds) => {
									return (
										<AutoComplete.Option key={in_ds} text={it_ds.value}>
											{it_ds.value}
										</AutoComplete.Option>
									);
								})
								: []
							}
						onSelect={(event, selectedItem) =>
						  onChangeInput({ target: { value: selectedItem.props.text } }, item)
						}
						onSearch={event => handlerAutoComplete(event, item)}
						placeholder='enter the value'
						value={data[item.key]}
						onChange={event => onChangeData(event, item)}
						onBlur={value => {
						  if (value === undefined) onChangeInput({ target: { value: null } }, item);
						}}
					  />
					</div>
				);
				break;
			case 'datetime':
			    return (
					<div key='d3.1' label={item.title}><div><b>{item.title}</b></div>
						<DatePicker
							disabled={item.read_only || false}
							value={data[item.key] ? moment(data[item.key], 'DD.MM.YYYY HH:mm') : null}
							onChange={(f, ev) => onChangeInput(ev, item)}
							format='DD.MM.YYYY HH:mm'
						/>
					</div>
				);
			case 'number':
				return (
					<div key='d4' label={item.title}><div><b>{item.title}</b></div>
						<input
							type='number'
							style={inputStyles}
							disabled={item.read_only || false}
							value={data[item.key] === null ? null : data[item.key]}
							onChange={event => {
								onChangeData(event, item);
							}}
							onBlur={event => onChangeInput(event, item)}
						/>
					</div>
				);
				break;
			case 'rate':
				return (
					<div key={item.key} label={item.title}><div><b>{item.title}</b></div>
						<Rate
							allowHalf
							defaultValue={data[item.key] === null ? 0 : data[item.key]}
							onChange={event => {
								onChangeData(event, item);
							}}
						/>
					</div>
				);
				break;
			case 'tags':
				return (
					<div key={item.key} label={item.title}><div><b>{item.title}</b></div>
						<input
							className = 'ant-input'
							value = {data[item.key+item.key]}
							onChange = {(e) => {
								let item2 = {key:item.key+item.key}
								onChangeData(e, item2)
							}}
							onKeyPress = {(event) => {
								if(event.key === 'Enter'){
									let v = data[item.key] || []
									v.push(event.target.value)
									let item2 = {key:item.key+item.key}
									onChangeData(v, item)
									onChangeData('', item2)
								}
							}}
						/>
						<button style={{display:'none'}} title = '+' />
						<div>
							{(data[item.key] || []).map((tag) => (
								<Tag 
									key = {tag} closable onClose={() => {
										onChangeData(data[item.key].filter((x) => x != tag), item)
									}}
								>
									{tag}
								</Tag>
							))}
						</div>
					</div>
				);
				break;
			case 'password':
				return (
					<div key='d4.1' label={item.title}><div><b>{item.title}</b></div>
						<input
							type='password'
							style={inputStyles}
							disabled={item.read_only || false}
							value={data[item.key]}
							onChange={event => onChangeData(event, item)}
							onBlur={event => onChangeInput(event, item)}
							placeholder='password'
						/>
					</div>
				);
			case 'link':
				return (
					<div key='d4.1' label={item.title}><div><b>{item.title}</b></div>
						<div>
							{typeof data[item.key] !== 'object' ? (
								<a href={data[item.key]} target='_blank' rel='noopener noreferrer'>
									{' '}
									{data[item.key]}
								</a>
							) : (
								<a
									href={(data[item.key] || { link: '' }).link}
									target={(data[item.key] || {target:null}).target || '_blank'}
									rel='noopener noreferrer'
								>
									{(data[item.key] || { title: '' }).title}
								</a>
							)}
						</div>
					</div>
				);
				break;
			case 'image':
			case 'file':
				let fileList = [];
					data[item.key]? _.forEach(data[item.key], (file, file_index, files) => {
						fileList.push({
							row: item, uid: '-1',
							name: file.filename, status: 'done',
							file_url: file.uri, url: api._url + file.uri
						});
					})
					: [];
				return (
					<div key='d4.2' label={item.title}><div><b>{item.title}</b></div>
						<Upload
							disabled={item.read_only || false}
							listType={item.type === 'image' ? 'picture-card' : 'text'}
							fileList={fileList}
							customRequest={event => onUpload(event, item, false)}
							onRemove={onRemoveImg}
							onPreview={event => {
								let file_sr = ['img', 'jpg', 'png', 'gif'];
								function findOf(na) {
									let result = false;
									file_sr.forEach(el => {
										result = !result ? na.split('.')[1] === el : result;
									});
									return result;
								}
								if (findOf(event.name)) {
									if (event.file_url) set_state({ previewFile: event });
									else set_state({ previewFile: false });
								} else window.open(event.url, '_blank');
							}}
							onChange={onUploadFileChange}
						>
							{fileList.length > 0 ? null : !uploaded ? (
								<div key='d1.2' className={item.type === 'file' ? 'getone__upload-file' : null}>
									{item.type === 'image' ? <Icon type='plus' /> : null}
									<div className='ant-upload-text'>
										{' '}
										{item.type === 'image' ? 'Upload image' : 'Upload file'}
									</div>
								</div>
							) : (
								<Progress type='circle' percent={uploaded || 0} />
							)}
						</Upload>
						<Modal
							visible={previewFile ? true : false}
							footer={null}
							onCancel={() => set_state({ previewFile: false })}
						>
							<img alt='example' style={{ width: '100%' }} src={previewFile.url || ''} />
						</Modal>
					</div>
				);
				break;
			case 'files':
				return (
					<div key={data[item.key]}>
						<input
							multiple
							onChange={e => onUploadFileChange(e, item, false)}
							type='file'
							placeholder={'placeholder'}
						/>
						<ul className='getone__filelist'>
							{data[item.key]? data[item.key].map(file => (
								<li key={file.uri} className='getone__filelist-item'>
									<div style={{ paddingLeft: 20 }}>{file.label || file.filename}</div>
									<div className='getone__filelist-buttons'>
										<Tooltip title='Download' placement='topLeft'>
											<Button
												icon='download' size='small'
												shape='circle'
												style={{ border: '1px solid grey' }}
												onClick={() => window.open(api._url + file.uri)}
											/>
										</Tooltip>
										<Tooltip title='Delete' placement='topLeft'>
											<Button
												icon='delete' size='small'
												shape='circle'
												style={{ border: '1px solid grey', backgroundColor: 'crimson' }}
												onClick={() => onRemoveFile(data[item.key], file.uri, item)}
											/>
										</Tooltip>
									</div>
								 </li>
							))
							: null}
						</ul>
					</div>
				);
				break;
			case 'filelist':
			    return (
					<div key='9.b' label='Filelist'>
						<List
							itemLayout='horizontal'
							locale={{emptyText:'...'}}
							dataSource={data[item.key] ? data[item.key] : []}
							renderItem={item => (
								<List.Item>
									<List.Item.Meta
										avatar={<Avatar icon='file' />}
										title={
											<Tooltip title='Download' placement='right'>
											    <a target = '_blank' href={item.src}>{item.filename}</a>
											</Tooltip>
										}
									/>
								</List.Item>
							)}
						/>
					</div>
				  );
			case 'images':
				return (
					<div key={data[item.key]}>
						<label 
							htmlFor='files' className='getone__images-label'>
							choose image
						</label>
						<input
							accept='.jpg, .jpeg, .png'
							id='files'
							style={{ visibility: 'hidden', height: 1 }}
							multiple
							onChange={e => onUploadFileChange(e, item, false)}
							type='file'
						/>
						<div className='getone__imageslist'>
							{data[item.key]? data[item.key].map(file => (
								<Tooltip title={file.label} key={file.uri}>
									<div
										key={file.uri}
										className='getone__images-item'
										style={{
											background: `url("${file.src}") 100% 100% no-repeat`,
											backgroundSize: 'contain',
											backgroundPosition: 'center center'
										}}
									>
										<div className='getone__imageslist-buttons'>
											<Tooltip title='Show' placement='topLeft'>
												<Button
													icon='eye'
													size='small'
													shape='circle'
													style={{ border: '1px solid grey' }}
													onClick={() => window.open(api._url + file.uri)}
												/>
											</Tooltip>
											<Tooltip title='Delete' placement='topLeft'>
												<Button
													icon='delete'
													size='small'
													shape='circle'
													style={{ border: '1px solid grey', backgroundColor: 'crimson' }}
													onClick={() => onRemoveFile(data[item.key], file.uri, item)}
												/>
											</Tooltip>
										</div>
									</div>
								</Tooltip>
							))
							: null}
						</div>
					</div>
				);
				break;
			case 'gallery':
				return (
					<div key='23.p' label='Images list'>
						<div className='getone__imageslist'>
							{data[item.key]? data[item.key].map((file, index) => (
								<Tooltip title={file.label} key={'gallerry' + file.uri}>
									<div
										key={file.uri}
										className='getone__images-item'
										style={{
											background: `url("${file.src}") 100% 100% no-repeat`,
											backgroundSize: 'contain',
											backgroundPosition: 'center center'
										}}
									>
										<div className='getone__imageslist-buttons'>
											<Tooltip title='Show' placement='topLeft'>
												<Button
													icon='eye' size='small' shape='circle'
													style={{ border: '1px solid grey' }}
													onClick={() => window.open(api._url + file.uri)}
												/>
											</Tooltip>
											<Tooltip title='Slider' placement='topLeft'>
												<Button
													icon='picture' size='small' shape='circle'
													style={{ border: '1px solid grey', background: 'GreenYellow' }}
													onClick={() => {
														set_state({ visibleModal: true });
															carouselRef.current !== null
															? carouselRef.goTo(index)
															: set_state({ initIndex: index });
													}}
												/>
											</Tooltip>
										</div>
									</div>
								</Tooltip>
							))
							: null}
						</div>
						<Modal
							width={1300} visible={visibleModal}
							onCancel={() => set_state({ visibleModal: false })}
							footer={null}
						>
							<Carousel
								ref={slider => (carouselRef = slider)}
								arrows={true}
								nextArrow={<CustomArrowNext />}
								prevArrow={<CustomArrowPrev />}
								infinite={true} speed={500}
								slidesToShow={1}
								slidesToScroll={1}
								initialSlide={initIndex}
							>
								{data[item.key]
									? data[item.key].map(file => <img src={file.src} key={file.uri} />)
									: null
								}
							</Carousel>
						</Modal>
					</div>
				);
				break;
			case 'select':
			case 'select_api':
				return (
					<div key='5.b' label={item.title}><div><b>{item.title}</b></div>
						<Select
							name={
								([1e7]+-1e3+-4e3+-8e3+-1e11)
								.replace(/[018]/g,c=>(
									c^crypto.getRandomValues(
									  new Uint8Array(1))[0]&15 >> c/4
									).toString(16))
							}  config={item}
							data={data} inputs={params.inputs}
							onChangeInput={onChangeInput}
							location={location}
							globalConfig={config}
						/>
					</div>
				);
				break;
			case 'multiselect':
			case 'multiselect_api':
				return (
					<div key='12.b' label={item.title}><div><b>{item.title}</b></div>
						<MultiSelect
							name={
								([1e7]+-1e3+-4e3+-8e3+-1e11)
								.replace(/[018]/g,c=>(
									c^crypto.getRandomValues(
									  new Uint8Array(1))[0]&15 >> c/4
									).toString(16))
							}
							config={item} data={data}
							inputs={params.inputs}
							onChangeInput={onChangeInput}
							location={location}
							globalConfig={config}
						/>
					</div>
				);
			case 'typehead':
			case 'typehead_api':
				return (
					<div key={item.key} label={item.title}><div><b>{item.title}</b></div>
						<Typeahead
							name={
								([1e7]+-1e3+-4e3+-8e3+-1e11)
								.replace(/[018]/g,c=>(
									c^crypto.getRandomValues(
									  new Uint8Array(1))[0]&15 >> c/4
									).toString(16))
							}
							config={item} data={data}
							inputs={params.inputs}
							onChangeInput={onChangeInput}
							location={location}
							globalConfig={config}
						/>
					</div>
				);
				break;
			case 'multitypehead':
			case 'multitypehead_api':
				return (
					<div key='7.b' label={item.title}><div><b>{item.title}</b></div>
						<MultiTypehead
							name={
								([1e7]+-1e3+-4e3+-8e3+-1e11)
								.replace(/[018]/g,c=>(
									c^crypto.getRandomValues(
									  new Uint8Array(1))[0]&15 >> c/4
									).toString(16))
							}
							config={item} data={data}
							inputs={params.inputs}
							onChangeInput={onChangeInput}
							location={location}
							globalConfig={config}
						/>
					</div>
				);
				break;
			case 'checkbox':
				return (
					<div key='d4.6' label={item.title}><div><b>{item.title}</b></div>
						<Tooltip placement='topLeft' title={item.title || ''}>
							<Checkbox
								disabled={config.read_only || false}
								checked={data[item.key] || false}
								onChange={event => {
									onChangeInput(event.target.checked, item);
								 }}
							>
								{item.title}
							</Checkbox>
						</Tooltip>
					</div>
				);
				break;
			case 'certificate':
				return (
					<div key='d5' label={item.title}><div><b>{item.title}</b></div>
						<Certificate
							config={item}
							data={data}
							location={location}
							onChangeInput={onChangeInput}
						/>
					</div>
				);
				break;
			case 'time':
			  return (
				<div key='d6' label={item.title}><div><b>{item.title}</b></div>
					<TimePicker
						format={'HH:mm'}
						placeholder='Chose time'
						value={data[item.key] === null ? null : moment(data[item.key] || '', 'HH:mm')}
						onChange={(time, timeString) => {
							timeString === '' ? (timeString = null) : timeString;
							onChangeInput(timeString, item);
						}}
					/>
				</div>
			);
			case 'colorpicker':
				return (
					<div key='23c' label={item.title}><div><b>{item.title}</b></div>
						<ColorPicker
							currentColor={data[item.key] || '#000000'}
							onChangeInput={onChangeInput}
							localConfig={item}
						/>
						</div>
				);
			case 'color':
				return (
					<div key='24c' label={item.title}><div><b>{item.title}</b></div>
						<div
							style = {{
								width: '30px', height: '30px', borderRadius: '50%',
								backgroundColor: `${data[item.key]}`,
								border: '2px solid grey'
								}}
						></div>
					</div>
				);
			case 'texteditor':
				return (
					<div key='1t' label={item.title}><div><b>{item.title}</b></div>
						<TextEditor
							currentText={data[item.key] || ''}
							onChangeInput={onChangeInput}
							localConfig={item}
						/>
					</div>
				);
			case 'innerHtml':
				function createMarkup() {
					return { __html: `${data[item.key]}` };
					}
				return (
					<div key='2t' label={item.title}><div><b>{item.title}</b></div>
						<div dangerouslySetInnerHTML={createMarkup()} />
					</div>
				);
			case 'array':
				const dataTable = data[item.key]? 
					data[item.key].map(it => {
						return {
							...it,
							key: it.id
						};
					})
				: null;
					let dataColumns = [];
				if (data[item.key]) {
					for (let property in data[item.key][0]) {
						dataColumns.push({
							title: `${property}`.toUpperCase(),
							dataIndex: `${property}`,
							key: `${property}`
						});
					}
				}
				return (
					<div key='32u' label={item.title}><div><b>{item.title}</b></div>
							<Collapse defaultActiveKey={['1']}>
							
								<Table
									pagination={false}
									dataSource={dataTable}
									columns={dataColumns}
									scroll={{ x: true }}
									className='getone__table'
									locale={{
									  emptyText: '...'
									}}
								/>
							
						</Collapse>
					</div>
				);
			case 'codeEditor':
				return (
					<div key='2t' label={item.title}><div><b>{item.title}</b></div>
						<AceEditor
							mode='python'
							value={data[item.key] || ''}
							onChange={event => onChangeData(event, item)}
							fontSize={14}
							showPrintMargin={true}
							showGutter={true}
							highlightActiveLine={true}
							setOptions={{
								enableBasicAutocompletion: false,
								enableLiveAutocompletion: false,
								enableSnippets: false,
								showLineNumbers: true,
								tabSize: 2
							}}
						/>
					</div>
				);
			case 'phone':
				return (
					<div key='phone' label={item.title}><div><b>{item.title}</b></div>
						
						<InputMask
							className ='ant-input'
							mask='+9 (999) 999-99-99' value={data[item.key]}
							onChange={e => onChangeData(e, item)}
							onBlur={e => onChangeInput(e)}
						/>
					</div>
				);
			case 'multidate':
				return (
					<div key='multidate' label={item.title}><div><b>{item.title}</b></div>
						<MultiDate
							config={item} data={data}
							onChangeInput={onChangeInput}
							onChangeData={onChangeData}
							origin={origin}
						/>
					</div>
				)
			default:
				return (
					<div key='d22' label={item.title}><div><b>{item.title}</b></div>
						{item.type}
					</div>
				);
				break;
		}
    },
	render_form = (
		<Row>
			<Col s={12}>
				<Row>
					{_.filter( config, item =>
						(item.visible === true || item.visible === 1) &&
							visibleCondition(data, item.visible_condition, params.inputs)
					).map((item, ind, arr) => {
						let width = item.width ? (item.width > 12 ? 12 : parseInt(item.width)) : 12;
						return (
							<Col className={item.classname} s={(width > 12) ? 12 : width} key={'ss' + ind}>
								<div className={item.classname}>{render_childs(item)}</div>
							</Col>
						);
					})}
				</Row>
			</Col>
			<Col s={12}>
				<ActionsBlock
					actions={origin.acts} origin={origin}
					data={data} params={params}
					history={history} location={location}
					getData={getData} onSave={onSave}
					setLoading = {setLoading}
				/>
			</Col>
		</Row>
	);
	// ------------------------------------------------------------------------------------------------------------------------

	return (
		<Collapsible accordion={true} key={origin.title + 'rrr'} >
			<CollapsibleItem node='div' onClick={onChangeCollapse} header={(origin.title || '').toUpperCase()} key={origin.title} expanded={ collapseAll }>
				<div style={collapseAll || localChangeCollapse? {} : {display: 'none'}}>
					<h3>{params.inputs._sub_title}</h3>
					{loading ? (
						<Preloader >
							<Card className='f_content_app' />
						</Preloader>
					) : (
						<div>
							{render_form}
						</div>
					)}
				</div>
			</CollapsibleItem>
		</Collapsible>
	);
};

export default enhance(GetOne);
