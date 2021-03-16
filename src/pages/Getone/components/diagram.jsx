import { message } from 'antd'
import React, {useEffect, useState} from 'react'
import { Line } from 'react-chartjs-2'
import { apishka } from 'src/libs/api'

// const data1 = {
//	 labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//	 datasets: [
//		 {
//			 label: 'My First dataset',
//			 fill: false,
//			 lineTension: 0,
//			 borderColor: 'rgba(75,192,192,1)',
//			 data: [65, 59, 80, 81, 56, 55, 93, 102]
//		 }
//	 ]
// }

const Diagram = ({data, config, inputs}) => {
	// guard expression
	if (config.select_api === null) 
		return message.error(`select_api is null - '${config.title}'`)

	const [dataFromApi, setDataFromApi] = useState({})
	const getDataFromApi = () => {
		apishka('POST', {
			data, inputs, config
		}, config.select_api, res => {
			const { datasets, y } = res.outjson
			const enhancedDatasets = datasets.map(set => ({
				data: set.x, label: set.label,
				fill: false, lineTension: 0,
				borderColor: set.color || 'rgba(75,192,192,1)'
			}))
			const preparedData = {
				labels: y, datasets: enhancedDatasets
			}
			setDataFromApi(preparedData)
		})
	}

	useEffect(() => {
		getDataFromApi()
	}, [])

	return (
		<div>
			<Line data={dataFromApi} />
		</div>
	)
}

export default Diagram