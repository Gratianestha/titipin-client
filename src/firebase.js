import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCep_fP55HcF6P7qrvhDSyG3SAvKPUD1o0",
    authDomain: "titipin221.firebaseapp.com",
    projectId: "titipin221",
    storageBucket: "titipin221.appspot.com",
    messagingSenderId: "1042091225711",
    appId: "1:1042091225711:web:d69c0bafec44ea9751139a"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth()
export {db, app, auth}