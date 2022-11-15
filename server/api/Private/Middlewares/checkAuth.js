import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../src/config/envKeys';

module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		await jwt.verify(token, JWT_SECRET);
			
		next();
	}
	catch (error) {
		console.log(error.message);
		res.json({type: false, message: 'unauthorized'});
	}
};