import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC9u_p0IUcu3YBgfV1MkmFm3pBz8sNNp9Q",
    authDomain: "lostfoundmk03.firebaseapp.com",
    projectId: "lostfoundmk03",
    storageBucket: "lostfoundmk03.appspot.com",
    messagingSenderId: "318202955318",
    appId: "1:318202955318:web:cf9694553f729965727a97"
  
};

// Log Firebase config for debugging (remove in production)
console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '***' : 'missing',
  appId: firebaseConfig.appId ? '***' : 'missing'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export default app; 