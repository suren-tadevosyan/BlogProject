// Firestore.js
import { getFirestore } from "firebase/firestore";
import app from "./firebase.js"; // Import the Firebase app

const firestore = getFirestore(app);

export default firestore;
