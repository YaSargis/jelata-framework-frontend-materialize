import React from 'react';
import enhance from './enhance';
import Select from 'react-select';


import { 
	Col, Row, Card, Button, Icon
} from 'react-materialize';

const Report = ({
	values, params, changeInputs,
	inputs, selections, getSelectOptions,
	getReportFile
}) => {
	const { title } = values;
	const { Option } = Select;
	const inputStyles = {border: '1px solid #9e9e9e', height: '2.5rem', paddingLeft: '8px', fontSize:'15px', borderRadius:'5px'}

	return [
		<Card key='1l'>
			<h3>{title}</h3>
				{params.map((item) => {
					return (
						<Col s={12} key = {item.ptitle}>
							{(() => {
								switch(item.typename) {
									case "select":
										let ptitle = item.id + item.ptitle;
										return (
											<div>
												<div><b>{item.ptitle}</b></div>
												<Select
													styles={{
														menuPortal: (base) => ({
															...base, zIndex: 9999
														}), dropdownIndicator: (base) => ({
															...base, padding: 4
														}), clearIndicator: (base) => ({
															...base, padding: 4
														}), control: (base) => ({
															...base, minHeight: 0
														}), input: (base) => ({
															...base, padding: 0
														}), valueContainer: (base) => ({
															...base, padding: "0 8px", color: '#000000'
														}), placeholder: (base)=>({
															...base, color: '#cdbfc7'
														})
													}}
													defaultValue = {inputs[item.func_paramtitle]}
													onFocus = {() => getSelectOptions(ptitle,null,item.apimethod)}
													options={selections[ptitle]}
												/>
											</div>
										)
									case "multiselect":
										return (
											<div key = {item.ptitle + item.id}>
												<div><b>{item.ptitle}</b></div>
												<Select
													isMulti
													styles={{
														menuPortal: (base) => ({
															...base, zIndex: 9999
														}), dropdownIndicator: (base) => ({
															...base, padding: 4
														}), clearIndicator: (base) => ({
															...base, padding: 4
														}), control: (base) => ({
															...base, minHeight: 0
														}), input: (base) => ({
															...base, padding: 0
														}), valueContainer: (base) => ({
															...base, padding: "0 8px", color: '#000000'
														}), placeholder: (base)=>({
															...base, color: '#cdbfc7'
														})
													}}
													onChange = {(...args) => {
														let inp = inputs,
															e = args[0];
															_.isNull(e) ?
															delete inp[item.func_paramtitle]
															: inp[item.func_paramtitle] = e;
															changeInputs( inp )
													}}
													devaultValue = {inputs[item.func_paramtitle]}
													onFocus = {() => getSelectOptions(ptitle, null, item.apimethod)}
													options={selections[ptitle]}
												/>
											</div>
										)
									case "typehead":
										return (
											<div>
												<div><b>{item.ptitle}</b></div>

												<input
													style={inputStyles}
													value = {(inputs[item.func_paramtitle] || {}).label}
													onChange = {(e) => {
														let inp = inputs
														inp[item.func_paramtitle] = inp[item.func_paramtitle] || {}
														inp[item.func_paramtitle].label = substr
														changeInputs(inp)
														let substr = e.target.value
														if (substr && substr.length > 2) getSelectOptions(ptitle, substr, item.apimethod)
													}}

												/>
												<ul style={{}}>
													{(selections[ptitle] || []).map((it) => (
														<li 
															className='autocompli' 
															style={{ 
																cursor:'pointer', borderRadius:'12px', margin:3, padding: 5, 
																height:35, border:'0.3pt solid #c8c8b6'
															}}
															onClick={() => {
																let inp = inputs;
																inp[item.func_paramtitle] = it;
																selections[ptitle]=[]
																changeInputs(inp);
															}}
														>
															{it.label}
														</li>))
													}
												</ul>
											</div>
											
										)
									default:
										return (
											<div key={item.ptitle+item.id}>
												<div><b>{item.ptitle}</b></div>
												<input
													style={inputStyles}
													onChange = {(e) => {
														let inp = inputs;
														inp[item.func_paramtitle] = e.target.value;
														changeInputs(inp);
													}}
													defaultValue={inputs[item.func_paramtitle]}
													type = {item.typename}
													placeholder = {item.ptitle} />
											</div>
										)
								}})()
							}
						</Col>
					)}
				)}
			<Button onClick={ getReportFile } style={{ marginTop: '10px'}}>
				Generate
			</Button>
		</Card>
	]
};

export default enhance(Report);
