import { initializeApp } from "firebase/app";
import firebaseConfig from '../config/firebase-config.json'

import { getFirestore } from 'firebase/firestore'


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
  
export default db;