const moment = require('moment');

const timeStamp = moment().valueOf();

const generateMessage = (from, text) => ({
    from,
    text,
    createdAt: timeStamp,
  });

const generateLocationMessage = (from, latitude, longitude) => ({
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: timeStamp,
  });

module.exports = { generateMessage, generateLocationMessage };
