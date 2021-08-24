import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyC4GqWFk3Y8CGGA-3fet0n-YL8zYE0yB9A",
        authDomain: "instagram-clone-28bcd.firebaseapp.com",
        databaseURL: "https://instagram-clone-28bcd-default-rtdb.firebaseio.com",
        projectId: "instagram-clone-28bcd",
        storageBucket: "instagram-clone-28bcd.appspot.com",
        messagingSenderId: "1063242834098",
        appId: "1:1063242834098:web:ed318c71a219eb05a4e9ab",
        measurementId: "G-STZ2P8QTEJ"
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export { db, auth, storage };
