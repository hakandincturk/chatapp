import Joi from 'Joi';

class AuthValidation{

	static async registerValidation(data){
		try {
			const schema = Joi.object().keys({
				username: Joi.string().min(3).max(18).required(),
				email: Joi.string().email().required(),
				password: Joi.string().min(5).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
				name: Joi.string().min(3).required(),
				surname: Joi.string().min(3).required()
			});

			await schema.validateAsync(data);
			return ({type: true});

		}
		catch (error) {
			return ({type: false, message: error.message});
		}
	}

	static async loginValidation(data){
		try {
			const schema = Joi.object().keys({
				email: Joi.string().email().required(),
				password: Joi.string().min(5).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
			});
	
			await schema.validateAsync(data);
			return ({type: true});
		}
		catch (error) {
			return ({type: false, message: error.message});
		}
	}

}

export default AuthValidation;