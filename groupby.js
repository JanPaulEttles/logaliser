const moment = require('moment');

//https://appdividend.com/2018/12/18/javascript-array-map-example-array-prototype-map-tutorial/

const data = [{
	source: "1.1.1.1",
	entries: [
		{ timestamp: '02/Aug/2019 09:02:53', status: 200 },
		{ timestamp: '03/Aug/2019 09:27:54', status: 200 },
		{ timestamp: '05/Aug/2019 09:27:55', status: 200 },
		{ timestamp: '02/Aug/2019 09:27:53', status: 302 },
		{ timestamp: '02/Aug/2019 09:27:57', status: 404 },
		{ timestamp: '02/Aug/2019 09:27:51', status: 500 },
		{ timestamp: '02/Aug/2019 09:27:52', status: 500 },
		{ timestamp: '02/Aug/2019 09:27:53', status: 500 },
		{ timestamp: '02/Aug/2019 09:27:53', status: 500 },
		{ timestamp: '02/Aug/2019 09:27:53', status: 500 },
		{ timestamp: '02/Aug/2019 09:27:53', status: 200 },
		{ timestamp: '02/Aug/2019 09:27:53', status: 302 },
		{ timestamp: '02/Aug/2019 09:27:53', status: 302 },
		{ timestamp: '02/Aug/2019 09:27:53', status: 302 }
	]
}];


//console.log(groupBy(data, 'day'));
console.log(JSON.stringify(format(groupBy(data[0].entries, 'hour')), null, 2));

function format(data) {
	const formatted = data.map(elem => {
		return {
			label: elem.status,
			data: formattimestamps(elem.timestamps),
			backgroundColor: 'rgba(' + elem.status + ', 132, 0, 0.6)',
			borderWidth: 2,
			fill: false
		}
	})

	return formatted;

}

function formattimestamps(data) {

	const formatted = [];
	Object.keys(data).forEach(function(key, index) {

		formatted.push({
			x: key,
			y: data[key]
		});
	});

	return formatted;

}

function groupBy(elements, duration) {


	const formatted = elements.map(elem => {

		let current_datetime = new Date(elem.timestamp)


		current_datetime = current_datetime.toISOString().replace('T', ' ');
		current_datetime = current_datetime.substring(0, current_datetime.indexOf('.'));
		console.log(current_datetime);
		/*
		let formatted_date = current_datetime.getFullYear();
		formatted_date += "-";
		formatted_date += current_datetime.getMonth() + 1;
		formatted_date += "-"
		formatted_date += current_datetime.getDate()
		formatted_date += " ";
		formatted_date += current_datetime.getHours()
		formatted_date += ":";
		formatted_date += current_datetime.getMinutes() + ":" + current_datetime.getSeconds();


		let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
*/
		//let formatted_date = current_datetime.
		//		console.log(formatted_date);

		return { timestamp: moment(current_datetime).startOf(duration).format('YYYY-MM-DD hh:mm:ss'), status: elem.status }
	})

	const grouped = [];
	formatted
		.map(elem => elem.status)
		.filter((status, index, self) => self.indexOf(status) === index).forEach(function(item) {
			const fin = formatted
				.filter(entry => entry.status === item)
				.map(filtered => filtered.timestamp)
				.reduce(function(accumulator, timestamp) {
					accumulator[timestamp] = ++accumulator[timestamp] || 1;
					return accumulator;
				}, {});
			grouped.push({ status: item, timestamps: fin });
		})

	return grouped;

}