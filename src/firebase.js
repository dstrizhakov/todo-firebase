import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyBwGvQ6jXw-Qfr95ZDI5E0D9wn3WN2cWac",
    authDomain: "todo-list-1b479.firebaseapp.com",
    projectId: "todo-list-1b479",
    storageBucket: "todo-list-1b479.appspot.com",
    messagingSenderId: "986348955134",
    appId: "1:986348955134:web:e7a6efe909e18215238caf"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp)
const db = getFirestore(firebaseApp);


export { db, storage };