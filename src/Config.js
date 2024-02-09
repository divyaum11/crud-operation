import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';  // Import only the necessary modules
import 'firebase/compat/storage';

// const settings = { timestampsInSnapshots: true };

const firebaseConfig = {
    apiKey: "AIzaSyBnJCDVj_fZ1_ALCZdJHaOeysv87iHACuA",
    authDomain: "curdoperations-b25b8.firebaseapp.com",
    projectId: "curdoperations-b25b8",
    storageBucket: "curdoperations-b25b8.appspot.com",
    messagingSenderId: "719155001807",
    appId: "1:719155001807:web:4de46ab4383d0f48683aba"
};
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export const storage = firebase.storage();


export default firebase;
// Initialize Firebase