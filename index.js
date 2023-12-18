const express = require('express');
const cors = require('cors')
const app = express();
const router = require('./router/router')
// const {getAllUsers} = require('./controllers/User')
// const {firebase}= require('./config')
// const { getFirestore, collection, getDocs,addDoc, updateDoc, doc, setDoc,getDoc} = require('firebase/firestore');
// const firestore = getFirestore(firebase);
// app.post('/push',async(req,res)=>{
//     try {
//         const myCollection = collection(firestore, 'temp');
//         await addDoc(myCollection, {temp:'hahaha'});
//         console.log("Document successfully add!");
//         res.send({ message: 'Question added successfully' });
//       } catch (error) {
//         console.error("Error adding document: ", error);
//         res.status(500).json({ success: false, message: 'something went wrong when adding question'});
//       }
// })
app.use(express.json());
app.use(cors())
app.use('/api', router)
app.listen(3001,()=>{
    console.log('server is running')
})