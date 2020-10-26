import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enhance from './enhance';
import ActionBlock from 'src/pages/layout/actions';
import { Configer } from 'src/libs/methods';
const localizer = momentLocalizer(moment);
const MyCalendar = ({ startDate, endDate, title, data, origin, acts, params, history, location, getData, onlyDayDate }) => {
	const arrPreparedForLib = [];

	data.forEach( item => {
		arrPreparedForLib.push({
			id: Configer.nanoid(),
			title: item[title.key],
			start: moment(item[startDate.key], 'DD.MM.YYYY HH.mm').toDate(),
			end: moment(item[endDate.key],'DD.MM.YYYY HH.mm').toDate(),
			resourse: item,
			currentDay: moment(item[onlyDayDate.key], 'DD.MM.YYYY').toDate()
		})
	});

	const localButtons = {
		date: 'Дата',
		time: 'Время',
		event: 'События',
		allDay: 'Весь день',
		week: 'Неделя',
		work_week: 'Рабочая неделя',
		day: 'День',
		month: 'Месяц',
		previous: '<',
		next: '>',
		yesterday: 'Вчера',
		tomorrow: 'Завтра',
		today: 'Сегодня',
		agenda: 'Список',
		noEventsInRange: 'В этом диапазоне нет событий... ',
		showMore: function showMore(total) {
			return "+" + total + " more";
		}
	};

	function EventAgenda({ event }) {
		return (
			<div key={Configer.nanoid()} style={{display: 'flex', justifyContent: 'space-between'}}>
				<strong>{event.title}</strong>
				<span style={{paddingLeft: 10}}>
				  <ActionBlock
					actions={origin.acts}
					origin={origin}
					data={event.resourse}
					params={params}
					history={history}
					location={location}
					getData={getData}
					calendar={true}
					/>
				</span>
			</div>
		)
	}

	return (
		<div className='calendar'>
			<Calendar
				defaultView='month' 
				localizer={localizer}
				events={arrPreparedForLib}
				messages={localButtons}
				components={{
					dateHeader: (props) => {
						const dataCell = arrPreparedForLib.filter(item => item.currentDay.toString() === props.date.toString());
						return (
							<div>
								<div style={{display: 'flex', justifyContent: 'space-between', padding: '0 10px'}}>
									<span>
										{ _.isEmpty(dataCell) ? (
												<ActionBlock
													actions={origin.acts}
													origin={origin}
													data={props}
													params={params}
													history={history}
													location={location}
													getData={getData}
													calendar={true}
												/> 
											): dataCell.map(item => {
												return (
													<ActionBlock
														key={Configer.nanoid()}
														actions={origin.acts}
														origin={origin}
														data={item.resourse}
														params={params}
														history={history}
														location={location}
														getData={getData}
														calendar={true}
													/>
												)
										})}
									</span>
									<span>
										{props.label}
									</span>
								</div>
							</div>
						)
					},
					agenda: {
						event: EventAgenda
					}
				}}
			/>
		</div>  
	)  
};

export default enhance(MyCalendar);  