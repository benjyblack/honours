var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	root: rootPath,
	port: process.env.PORT || 3000,
    db: process.env.MONGOHQ_URL,
    mailchimp: {
		apikey: 'e60376a181c62f3ddcb244acfd840ae1-us3',
		listId: '59aa66bc5c'
    }
};