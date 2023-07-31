import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAWo9-imqhlroGwn4Kl0NM-wEnj7aG55IA',
	authDomain: 'practice-619cf.firebaseapp.com',
	projectId: 'practice-619cf',
	storageBucket: 'practice-619cf.appspot.com',
	messagingSenderId: '19483783404',
	appId: '1:19483783404:web:ef08287dddd1039a5cb5c9'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
