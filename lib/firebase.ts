import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDu97T5ZPoSMKmJgL753-cSIs3I42Wa4RU",
    authDomain: "spreadsheet-app-bfe99.firebaseapp.com",
    projectId: "spreadsheet-app-bfe99",
    storageBucket: "spreadsheet-app-bfe99.firebasestorage.app",
    messagingSenderId: "125106899742",
    appId: "1:125106899742:web:253017ef467f73b722570f"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);