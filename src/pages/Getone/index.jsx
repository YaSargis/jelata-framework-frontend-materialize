import React from 'react';
import * as moment from 'moment';
import InputMask from 'react-input-mask';

import {
  Form, Spin, Card, Layout, Row,
  Col, Checkbox, Collapse,
  Carousel, Table, notification,
  Input, DatePicker, Upload,
  Modal, Progress, Icon,
  Tooltip, AutoComplete, TimePicker,
  Button, List, Avatar, InputNumber, Rate
} from 'antd';
const { Content } = Layout;

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
const { Panel } = Collapse;

const keyCollapse = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15 >> c/4).toString(16))


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
						<Form.Item key='1,1' label={item.title}>
							{JSON.stringify(data[item.key])}
						</Form.Item>
					);
				}
				return (
					<Form.Item key='1,1' label={item.title}>
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
					</Form.Item>
				 );
				break;
			case 'text':
				return (
					<Form.Item key='1.2' label={item.title}>
						<Input
							disabled={item.read_only || false}
							value={data[item.key] ? data[item.key] : ''}
							onChange={event => onChangeData(event, item)}
							onBlur={event => onChangeInput(event, item)}
						/>
					</Form.Item>
				);
				break;
			case 'textarea':
				return (
					<Form.Item key='d2.1' label={item.title}>
						<TextArea
							disabled={item.read_only || false}
							value={data[item.key] ? data[item.key] : ''}
							onChange={event => onChangeData(event, item)}
							onBlur={event => onChangeInput(event, item)}
						/>
					</Form.Item>
				);
				break;
			case 'date':
				return (
					<Form.Item key='d3' label={item.title}>
						<DatePicker
							disabled={item.read_only || false}
							value={data[item.key] ? moment(data[item.key], 'DD.MM.YYYY') : null}
							onChange={(f, ev) => onChangeInput(ev, item)}
							format='DD.MM.YYYY'
						/>
					</Form.Item>
				);
				break;
			case 'autocomplete':
				return (
					<Form.Item key='4.b' label={item.title}>
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
					</Form.Item>
				);
				break;
			case 'datetime':
			    return (
					<Form.Item key='d3.1' label={item.title}>
						<DatePicker
							disabled={item.read_only || false}
							value={data[item.key] ? moment(data[item.key], 'DD.MM.YYYY HH:mm') : null}
							onChange={(f, ev) => onChangeInput(ev, item)}
							format='DD.MM.YYYY HH:mm'
						/>
					</Form.Item>
				);
			case 'number':
				return (
					<Form.Item key='d4' label={item.title}>
						<InputNumber
							disabled={item.read_only || false}
							value={data[item.key] === null ? null : data[item.key]}
							onChange={event => {
								onChangeData(event, item);
							}}
							onBlur={event => onChangeInput(event, item)}
						/>
					</Form.Item>
				);
				break;
			case 'rate':
				return (
					<Form.Item key={item.key} label={item.title}>
						<Rate
							allowHalf
							defaultValue={data[item.key] === null ? 0 : data[item.key]}
							onChange={event => {
								onChangeData(event, item);
							}}
						/>
					</Form.Item>
				);
				break;
			case 'tags':
				return (
					<Form.Item key={item.key} label={item.title}>
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
					</Form.Item>
				);
				break;
			case 'password':
				return (
					<Form.Item key='d4.1' label={item.title}>
						<Input.Password
							disabled={item.read_only || false}
							value={data[item.key]}
							onChange={event => onChangeData(event, item)}
							onBlur={event => onChangeInput(event, item)}
							placeholder='password'
						/>
					</Form.Item>
				);
			case 'link':
				return (
					<Form.Item key='d4.1' label={item.title}>
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
					</Form.Item>
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
					<Form.Item key='d4.2' label={item.title}>
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
					</Form.Item>
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
					<Form.Item key='9.b' label='Filelist'>
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
					</Form.Item>
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
					<Form.Item key='23.p' label='Images list'>
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
					</Form.Item>
				);
				break;
			case 'select':
			case 'select_api':
				return (
					<Form.Item key='5.b' label={item.title}>
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
					</Form.Item>
				);
				break;
			case 'multiselect':
			case 'multiselect_api':
				return (
					<Form.Item key='12.b' label={item.title}>
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
					</Form.Item>
				);
			case 'typehead':
			case 'typehead_api':
				return (
					<Form.Item key={item.key} label={item.title}>
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
					</Form.Item>
				);
				break;
			case 'multitypehead':
			case 'multitypehead_api':
				return (
					<Form.Item key='7.b' label={item.title}>
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
					</Form.Item>
				);
				break;
			case 'checkbox':
				return (
					<Form.Item key='d4.6' label={item.title}>
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
					</Form.Item>
				);
				break;
			case 'certificate':
				return (
					<Form.Item key='d5' label={item.title}>
						<Certificate
							config={item}
							data={data}
							location={location}
							onChangeInput={onChangeInput}
						/>
					</Form.Item>
				);
				break;
			case 'time':
			  return (
				<Form.Item key='d6' label={item.title}>
					<TimePicker
						format={'HH:mm'}
						placeholder='Chose time'
						value={data[item.key] === null ? null : moment(data[item.key] || '', 'HH:mm')}
						onChange={(time, timeString) => {
							timeString === '' ? (timeString = null) : timeString;
							onChangeInput(timeString, item);
						}}
					/>
				</Form.Item>
			);
			case 'colorpicker':
				return (
					<Form.Item key='23c' label={item.title}>
						<ColorPicker
							currentColor={data[item.key] || '#000000'}
							onChangeInput={onChangeInput}
							localConfig={item}
						/>
						</Form.Item>
				);
			case 'color':
				return (
					<Form.Item key='24c' label={item.title}>
						<div
							style = {{
								width: '30px', height: '30px', borderRadius: '50%',
								backgroundColor: `${data[item.key]}`,
								border: '2px solid grey'
								}}
						></div>
					</Form.Item>
				);
			case 'texteditor':
				return (
					<Form.Item key='1t' label={item.title}>
						<TextEditor
							currentText={data[item.key] || ''}
							onChangeInput={onChangeInput}
							localConfig={item}
						/>
					</Form.Item>
				);
			case 'innerHtml':
				function createMarkup() {
					return { __html: `${data[item.key]}` };
					}
				return (
					<Form.Item key='2t' label={item.title}>
						<div dangerouslySetInnerHTML={createMarkup()} />
					</Form.Item>
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
					<Form.Item key='32u' label={item.title}>
							<Collapse defaultActiveKey={['1']}>
							<Panel key={1}>
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
							</Panel>
						</Collapse>
					</Form.Item>
				);
			case 'codeEditor':
				return (
					<Form.Item key='2t' label={item.title}>
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
					</Form.Item>
				);
			case 'phone':
				return (
					<Form.Item key='phone' label={item.title}>
						<InputMask
							className ='ant-input'
							mask='+9 (999) 999-99-99' value={data[item.key]}
							onChange={e => onChangeData(e, item)}
							onBlur={e => onChangeInput(e)}
						/>
					</Form.Item>
				);
			case 'multidate':
				return (
					<Form.Item key='multidate' label={item.title}>
						<MultiDate
							config={item} data={data}
							onChangeInput={onChangeInput}
							onChangeData={onChangeData}
							origin={origin}
						/>
					</Form.Item>
				)
			default:
				return (
					<Form.Item key='d22' label={item.title}>
						{item.type}
					</Form.Item>
				);
				break;
		}
    },
	render_form = (
		<Form layout='vertical'>
			<Row gutter={8} type='flex'>
				<Col span={24}>
					<Row type='flex'>
						{_.filter( config, item =>
							(item.visible === true || item.visible === 1) &&
								visibleCondition(data, item.visible_condition, params.inputs)
						).map((item, ind, arr) => {
							let width = item.width ? (item.width > 24 ? 24 : parseInt(item.width)) : 12;
							return (
								<Col className={item.classname} span={width} key={'ss' + ind}>
									<div className={item.classname}>{render_childs(item)}</div>
								</Col>
							);
						})}
					</Row>
				</Col>
				<Col span={24}>
					<ActionsBlock
						actions={origin.acts} origin={origin}
						data={data} params={params}
						history={history} location={location}
						getData={getData} onSave={onSave}
						setLoading = {setLoading}
					/>
				</Col>
			</Row>
		</Form>
	);
	// ------------------------------------------------------------------------------------------------------------------------

	return (
		<Collapse
			key={keyCollapse}
			activeKey={localChangeCollapse ? localActiveKey : collapseAll ? [] : ['1']}
			onChange={onChangeCollapse}
		>
			<Panel className = {origin.classname || ''} header={(origin.title || '').toUpperCase()} key='1'>
				<h3>{params.inputs._sub_title}</h3>
				{loading ? (
					<Spin key='sk' spinning={true} tip='Loading...'>
						<Card className='f_content_app' />
					</Spin>
				) : (
					<Content key='s3' className={`f_content_app get_one_form`}>
						{render_form}
					</Content>
				)}
			</Panel>
		</Collapse>
	);
};

export default enhance(GetOne);
