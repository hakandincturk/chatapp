module.exports = {
	swaggerOptions: {
		swaggerDefinition: {
			info: {
				description: 'eCommerce',
				title: 'eCommerce',
				version: '1.0.0'
			},
			host: 'localhost:5000',
			basePath: '',
			produces: [
				'application/json',
				'application/xml'
			],
			schemes: [ 'http', 'https' ],
			security: [
				{
					JWT: []
				}
			],
			securityDefinitions: {
				JWT: {
					type: 'apiKey',
					in: 'header',
					name: 'Authorization',
					description: 'JWT Token'
				}
			}
		},
		basedir: __dirname, // app absolute path
		files: [
			'../../Public/Controllers/*.js',
			'../../Private/Controllers/*.js'
		]
	}
};
