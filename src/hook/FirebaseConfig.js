// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAEbtjcbfUT5PenbIUyXLqkoVpEQRjBVrs",
//   authDomain: "phongmachtu-52829.firebaseapp.com",
//   projectId: "phongmachtu-52829",
//   storageBucket: "phongmachtu-52829.appspot.com",
//   messagingSenderId: "633126895578",
//   appId: "1:633126895578:web:ccc702be563e893955cae3",
//   measurementId: "G-JMP2N8LRFE"
// };
const firebaseConfig = {
  apiKey: "AIzaSyCy978JAhmMYa3fxi9aM4SiizjZZ4X3Br0",
  authDomain: "phongmachtu-10d1d.firebaseapp.com",
  projectId: "phongmachtu-10d1d",
  storageBucket: "phongmachtu-10d1d.appspot.com",
  messagingSenderId: "810738314253",
  appId: "1:810738314253:web:f57920f25bf2025490b944",
  measurementId: "G-S3RYV7KJCJ"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
