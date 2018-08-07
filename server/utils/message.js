var moment = require('moment');

var timeStamp = moment().valueOf();

var generateMessage = (from, text) => {
	return {
		from, 
		text, 
		createdAt: timeStamp
	};
};

var generateLocationMessage = (from, latitude, longitude) => {
	return {
		from,
		url: `https://www.google.com/maps?q=${latitude},${longitude}`,
		createdAt: timeStamp
	};
};

module.exports = {generateMessage, generateLocationMessage};