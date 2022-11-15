/**
 * @typedef AuthReq
 * @property {string} email
 * @property {string} username
 * @property {string} name
 * @property {string} surname
 * @property {string} password
 *
 */

/** 
 * @typedef AuthReqLogin
 * @property {string} email
 * @property {string} password
 */

import AuthService from '../Services/AuthService';

class AuthController{

	/** 
	 * @route POST /public/auth/
	 * @group Auth
	 * @summary Create new user
	 * @param {AuthReq.model} body.body
	 * @returns {object} 200 - Success message
	 * @returns {Error} default - Unexpected error
	 */
	static async register(req, res){
		try {

			const result = await AuthService.register(req.body);

			if (result.type) return res.json({type: true, message: result.message});
			else return res.json({type: false, message: result.message});
		}
		catch (error) {
			return res.json({type: false, message: error.message});
		}
	}

	/**
	 * @route POST /public/auth/login
	 * @group Auth
	 * @summary Login
	 * @param { AuthReqLogin.model } body.body
	 * @returns {object} 200 - Success message
	 * @returns {Error} default - Unexpected error
	 */
	static async login(req, res){
		try {
			const result = await AuthService.login(req.body);

			if (result.type) return res.json({type: true, message: result.message, data: {token: result.token}});
			else return res.json({type: false, message: result.message});

		}
		catch (error) {
			return res.json({type: false, message: error.message});
		}
	}

	static async health( req, res ){
		return res.json({type: true, message: 'AuthRoute working successfuly'});
	}

}

export default AuthController;