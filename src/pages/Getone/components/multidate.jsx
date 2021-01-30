import React from "react";

import { 
	Chip, Icon
} from 'react-materialize';

const MultiDate = ({
	pickerVisible = false, set_state,
	changePicker, onCloseTag,
	config, data
}) => {
	return (
		<div
		  style={{
			display: "flex", alignItems: "center",
			border: "1px solid grey", borderRadius: 5, padding: 2,
		  }}
		>
			<div style={{ width: "content", flex: "10" }}>
				{data[config.key] && data[config.key].map((item) => (
					<Chip 
						key={item} close 
						closeIcon={
							<Icon 
								onClick = {()=>{
									onCloseTag(item)
								}} 
								className="close"
							>close
							</Icon>
							}
					>
						{item}
					</Chip>
				))}
				{pickerVisible && (
					<input type='date' onChange={changePicker} />

				)}
				{!pickerVisible && (
					<Icon onClick={() => set_state({ pickerVisible: true })}>add_circle_outline</Icon> 
				)}
			</div>
		</div>
	);
};


/*
					<DatePicker
						size="small"
						format="DD.MM.YYYY"
						onChange={changePicker}
					/>
*/
import { compose, withStateHandlers, withHandlers } from "recompose";

const enhance = compose(
	withStateHandlers(() => ({}), {
		set_state: (state) => (obj) => {
			let _state = { ...state },
			keys = Object.keys(obj);

			keys.map((key) => (_state[key] = obj[key]));
			return _state;
		},
	}),
	withHandlers({
		changePicker: ({ set_state, config, data, onChangeData, onChangeInput, origin }) => (
			/*date,
			dateString*/
			e
		) => {
			let date = e.target.value
			set_state({ pickerVisible: false });
			const localData = data[config.key] ? [...data[config.key]] : [];
			const isCollision = localData.includes(date.toString());
			if (isCollision) {
				alert('Date adding error');
			} else {
				localData.push(date.toString());
				const isFormFull = origin.viewtype === 'form full' ? true : false;
				isFormFull ? onChangeInput(localData, config) : onChangeData(localData, config);
			}
		},
		onCloseTag: ({ data, config, onChangeData, onChangeInput, origin }) => (item) => {
			const localData = data[config.key] ? [...data[config.key]] : [];
			const filtered = localData.filter((date) => date !== item);
			const isFormFull = origin.viewtype === 'form full' ? true : false;
			isFormFull ? onChangeInput(filtered, config) : onChangeData(filtered, config);
		}
	})
);

export default enhance(MultiDate);
