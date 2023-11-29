const { initializeApp } = require('firebase/app')
const firebaseConfig = {
    apiKey: "AIzaSyCy978JAhmMYa3fxi9aM4SiizjZZ4X3Br0",
    authDomain: "phongmachtu-10d1d.firebaseapp.com",
    projectId: "phongmachtu-10d1d",
    storageBucket: "phongmachtu-10d1d.appspot.com",
    messagingSenderId: "810738314253",
    appId: "1:810738314253:web:f57920f25bf2025490b944"
  };
const firebase= initializeApp(firebaseConfig);

module.exports = {firebase};