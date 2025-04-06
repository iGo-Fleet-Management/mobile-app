const { DateTime } = require('luxon');

exports.toDateOnly = (date) =>
  DateTime.fromISO(date, { zone: 'UTC' }).toFormat('yyyy-MM-dd');
