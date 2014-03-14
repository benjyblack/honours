'use strict';

var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	root: rootPath,
	port: process.env.PORT || 3000,
    db: process.env.MONGOHQ_URL,
    nodemailer: {
		service: 'Gmail',
		auth: {
			user: 'lectureimprov@gmail.com',
			pass: 'LectureImprov!'
		},
		name: 'LectureImprov'
    }
};