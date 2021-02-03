import React from 'react';


import InputMask from 'react-input-mask';
import FileGallery from 'src/components/file_gallery';



import { 
	Col, Row, Card, Preloader, Collapsible, CollapsibleItem, 
	Textarea, Autocomplete, Chip, Icon  as MIcon, Checkbox, Button,
	Tabs, Tab
} from 'react-materialize';



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
import AceEditor from 'react-ace';

import { visibleCondition, dateFormat } from 'src/libs/methods';


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
				break;
			case 'phone':
				return (
					<div key='phone' label={item.title}><div><b>{item.title}</b></div>
						<InputMask
							style={inputStyles}
							mask='+9 (999) 999-99-99' value={data[item.key]}
							onChange={e => onChangeData(e, item)}
							onBlur={e => onChangeInput(e)}
						/>
					</div>
				);
				break;
			case 'date':
				return (
					<div key='d3' label={item.title}><div><b>{item.title}</b></div>
						<input
							style={inputStyles}
							type='date'
							disabled={item.read_only || false}
							value={dateFormat(data[item.key], 'date')}
							onChange={(ev) => onChangeInput(ev.target.value, item)}
						/>
					</div>
				);
				break;
			case 'datetime':
			    return (
					<div key='d3.1' label={item.title}><div><b>{item.title}</b></div>
						<input
							style={inputStyles}
							type='datetime-local'
							disabled={item.read_only || false}
							value={dateFormat(data[item.key], 'datetime')}
							onChange={(ev) => onChangeInput(ev.target.value, item)}
						/>
					</div>
				);
				break;
			case 'time':
			  return (
				<div key='d6' label={item.title}><div><b>{item.title}</b></div>
					<input
						style={inputStyles}
						type='time'
						value={dateFormat(data[item.key], 'time')}
						onChange={(ev) => onChangeInput(ev.target.value, item)}
						placeholder='Chose time'
					/>
				</div>
			);
			case 'checkbox':
				return (
					<div key='d4.6' label={item.title}><div><b>{item.title}</b></div>
						<Checkbox 
							key={item.key}
							id={item.key}
							indeterminate={(data[item.key] === null || data[item.key] === undefined)? true : false}
							checked={data[item.key]}
							onChange={(e)=>{

								let v = data[item.key]
								if (v === null || v === undefined)
									v = true
								else if (v === true)
									v = false
								else
									v = null
								onChangeInput(v, item);
							}}
								
						/>
					</div>
				);
				break;
			case 'textarea':
				return (
					<div key='d2.1' label={item.title}><div><b>{item.title}</b></div>
						<textarea
							style={{border: '1px solid #9e9e9e'}}
							disabled={item.read_only || false}
							value={data[item.key] ? data[item.key] : ''}
							onChange={event => onChangeData(event.target.value) }
							onBlur={event => onChangeInput(event, item)}
						/>
					</div>
				);
				break;
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
			case 'tags':
				return (
					<div key={item.key} label={item.title}><div><b>{item.title}</b></div>
						<input
							style={inputStyles}
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
								<div 
									style = {{
										display: 'inline-block', height: '32px', 'fontSize': '13px', 'fontWeight': 500,	
										color: 'black', lineHeight: '32px', padding: '0 12px',
										borderRadius: '16px', backgroundColor: '#e4e4e4',
										marginBottom: '5px', marginRight: '5px'
										
									}}

									key = {tag}  
								>
									{tag}
									<MIcon 
										onClick = {()=>{
											let nData = data[item.key].filter((x) => x != tag)
											onChangeData(nData, item)}
										} 
										className='close' 
										style ={{cursor:'pointer'}}
									>
										close
									</MIcon>
								</div>
							))}
						</div>
					</div>
				);
				break;
			case 'autocomplete':
				return (
					<div key='4.b' label={item.title}><div><b>{item.title}</b></div>
						<input 
							style={inputStyles}
							value={data[item.key] ? data[item.key] : ''}
							onChange={e => {
								handlerAutoComplete(e.target.value, item)
								onChangeInput(e, item)
							}}

						/>
						<ul style={{}}>
							{(item.selectdata || []).map((it) => (
								<li 
									className='autocompli' 
									style={{ 
										cursor:'pointer', borderRadius:'12px', margin:3, padding: 5, 
										height:35, border:'0.3pt solid #c8c8b6'
									}}
									onClick={() => {
										onChangeInput(it.value, item)
										item.selectdata = []
									}}
								>
									{it.label}
								</li>))}
						</ul>
					</div>
				);
				break;


			case 'rate':
				let rate = parseFloat(data[item.key]) || 0
				let i = 0
				let trueRate = rate
				if (rate > 0 && (rate % 1) !== 0) {
					rate = rate - 1
				}
				const stars = []
				while ( i < rate ) {
					stars.push({'id': i+1, 'item':'star'})
					i += 1
				}
				i = 0
				while ( i < 5-rate ) {
					stars.push({'id': rate+i+1, 'item':'star_border'})
					i += 1
				}
				if (trueRate > 0 && (trueRate % 1) !== 0) {
					stars.push({'id': i+1, 'item':'star_half'})
				}
				
				return (
					<div key={item.key} label={item.title}>
						<div><b>{item.title}</b></div>
						<Row>
							<div>
								{stars.map((itm) => <MIcon onClick={(e) => onChangeData(itm.id, item)} className='starss' style={{color: '#ffef00', fontSize: '40px'}}>{itm.item}</MIcon>)}
							</div>
						</Row>
					</div>
				);
				break;



			
			case 'file':
			case 'files':
				return (
					<div key={data[item.key]}>
						<div><b>{item.title}</b></div>
						<input
							multiple={(item.type==='files')?true:false}
							onChange={e => onUploadFileChange(e, item, false)}
							type='file'
							
						/>
						<hr />
						<ul className='getone__filelist'>
							{data[item.key]? data[item.key].map(file => (
								<li key={file.uri} className='getone__filelist-item'>
									<Row>
										<Col>{file.label || file.filename}</Col>
										<Col>
											<Col>
												<Button
													floating
													small
													style={{ border: '1px solid grey' }}
													
												>
													<MIcon onClick={() => window.open(api._url + file.uri)}>download</MIcon>
												</Button>
											</Col>
											<Col>
												<Button
													floating
													small
													style={{ border: '1px solid grey', backgroundColor: 'crimson' }}
													onClick={() => onRemoveFile(data[item.key], file.uri, item)}
												>
													<MIcon>delete</MIcon>
												</Button>
											</Col>
										</Col>
									</Row>
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
						<div><b>{item.title}</b></div>
						<ul>
							{(data[item.key] || []).map(item => (
								<li>
									<a target = '_blank' href={item.src}>{item.filename}</a>
								</li>
							))}
						</ul>
					</div>
				  );
			case 'images':
			case 'image':
				return (
					<div key={data[item.key]}>
						<div><b>{item.title}</b></div>
						
						<input
							accept='.jpg, .jpeg, .png'
							id='files'
							
							multiple={item.type==='images'?true:false}
							onChange={e => onUploadFileChange(e, item, false)}
							type='file'
						/>
						<hr/>
						<Row>
						{(data[item.key] || []).map((im) => (
							
								<Col s={3}>
									<div onClick={() => window.open(api._url + im.uri)}  style={{backgroundColor:'black', height:400, width:400, textAlign: 'center', cursor:'zoom-in'}}>
										<img 
											
											width={350} style={{maxHeight:400}} 
											src = {api._url + im.uri} 
										/>
									</div>
									<Button 
										style={{ backgroundColor: 'crimson' }}
										onClick={() => onRemoveFile(data[item.key], im.uri, item)}
										className='crimson' small
										floating
									>
										<MIcon>delete</MIcon>
									</Button>
								</Col>
							
						
						))}
						</Row>
					</div>
				);
				break;
			case 'gallery':
				return (
					<div key='23.p' label='Images list'>
						<div><b>{item.title}</b></div>
						<FileGallery title={item.title} files={data[item.key] || []} />
	
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
						<Collapsible >
							<CollapsibleItem header={item.title}>
								<table>
									<thead>
										<tr>{
											Object.keys(data[item.key][0] || {}).map((k)=> <th>{k}</th> )
										}
										</tr>
									</thead>
									<tbody>
										{data[item.key].map(it => {
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
							</CollapsibleItem>
						</Collapsible>
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
						let width = item.width ? (item.width > 12 ? 12 : parseInt(item.width)) : 6;
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
