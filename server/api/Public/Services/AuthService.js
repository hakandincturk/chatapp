import fbAdmin from 'firebase-admin';

class AuthService{

	static async register(body){

		try {

			await fbAdmin.auth().createUser({email: body.email, password: body.password})
				.then( (link) => {
					console.log('firebase link --> ', link);
				});
		}
		catch (error) {
			throw error;
		}
	}

	static async login(body){
		try {

			await fbAdmin.auth().getUserByEmail(body.email)
				.then( (link) => {
					console.log('firebase link --> ', link);
				});
	
			return {
				type: true,
				message: 'You are now logged in.',
				token: 'Bearer 1'
			};	
		}
		catch (error) {
			throw error;
		}
	}

}

export default AuthService;