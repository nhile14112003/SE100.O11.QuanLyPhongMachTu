const { initializeApp } = require('firebase/app')
const admin = require('firebase-admin');
const serviceAccount = require('./asset/phongmachtu-10d1d-firebase-adminsdk-dayz4-81a3aaa4a0.json');
const firebaseConfig = {
    apiKey: "AIzaSyCy978JAhmMYa3fxi9aM4SiizjZZ4X3Br0",
    authDomain: "phongmachtu-10d1d.firebaseapp.com",
    projectId: "phongmachtu-10d1d",
    storageBucket: "phongmachtu-10d1d.appspot.com",
    messagingSenderId: "810738314253",
    appId: "1:810738314253:web:f57920f25bf2025490b944"
  };
const firebase= initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://phongmachtu-10d1d.appspot.com'
});
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const db = getFirestore()
module.exports = {firebase,admin,db};