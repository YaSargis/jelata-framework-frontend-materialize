import React from "react";
import { Tag, Icon, DatePicker, notification } from "antd";

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
					<Tag key={item} closable onClose={() => onCloseTag(item)}>
					  {item}
					</Tag>
				))}
				{pickerVisible && (
					<DatePicker
						size="small"
						format="DD.MM.YYYY"
						onChange={changePicker}
					/>
				)}
				{!pickerVisible && (
					<Tag
						onClick={() => set_state({ pickerVisible: true })}
						style={{ background: "#fff", borderStyle: "dashed" }}
					>
						<Icon type="plus" /> 
					</Tag>
				)}
			</div>
		</div>
	);
};

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
			date,
			dateString
		) => {
			set_state({ pickerVisible: false });
			const localData = data[config.key] ? [...data[config.key]] : [];
			const isCollision = localData.includes(dateString);
			if (isCollision) {
				notification.error({ message: "Date adding", duration: 2.5 });
			} else {
				localData.push(dateString);
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
