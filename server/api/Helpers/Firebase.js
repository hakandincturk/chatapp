// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import fbAdmin from 'firebase-admin';
import firebaseConfig from '../src/config/firebase-config.json';
import firebaseAdminConfig from '../src/config/fbAdmin-key.json';

class FirebaseApp{

	static app () {
		initializeApp(firebaseConfig);
		fbAdmin.initializeApp({
			credential: fbAdmin.credential.cert(firebaseAdminConfig)
		});
	}

}
// Initialize Firebase

export default FirebaseApp;