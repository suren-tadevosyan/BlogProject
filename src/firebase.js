
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBGTeLFqr3zxRsF-YmoRn2La0RcNQ4-5ug",
  authDomain: "reacblogapp.firebaseapp.com",
  projectId: "reacblogapp",
  storageBucket: "reacblogapp.appspot.com",
  messagingSenderId: "859347070171",
  appId: "1:859347070171:web:2e591157018c76582d70fe"
};


const app = initializeApp(firebaseConfig);

export default app

const auth = getAuth(app);

export { auth };