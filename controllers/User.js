const { getFirestore, collection, getDocs, addDoc, updateDoc, doc, setDoc,getDoc} = require('firebase/firestore');
const {firebase} = require('../config')
const firestore = getFirestore(firebase);
const nodemailer = require('nodemailer');
const setUserInfo = async (req, res) => {
    try {
      const myCollection = collection(firestore, 'Users');
      const docRef1 = doc(myCollection, req.params.userId);
      await setDoc(docRef1, req.body);
      console.log("Document successfully set!");
      res.send({ message: 'User data set successfully' });
    } catch (error) {
      console.error("Error setting user document: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when set user data'});
    }
  };
  const addUser = async(req,res)=>{
    const myCollection = collection(firestore, 'Users');
    try{
      const data = req.body;
      await addDoc(myCollection, data)
      .then((docRef) => {
        const d = doc(myCollection, docRef.id);
        updateDoc(d, {Id:docRef.id});
        console.log('save success')
        res.send({ message: 'Data saved successfully' });
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    }
    catch(error){
      console.error("Error addcomment: ", error);
    }
  }
  const SignIn = async (req,res) => {
    const myCollection = collection(firestore, 'Users');
    try{
    const querySnapshot = await getDocs(myCollection);
    let flag = false;
    let userInfo = {};
    querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if(data.SigninName == req.params.name && data.password==req.params.pass)
      {
        flag = true;
        userInfo = data
      }
    });
    res.json({success:true, userInfo:userInfo, flag:flag});
    }
    catch(error){
        console.log(error);
    }
  };
  const checkUserName = async(req,res)=>{
    const myCollection = collection(firestore, 'Users');
    try{
    const querySnapshot = await getDocs(myCollection);
    let flag = false;
    querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if(data.SigninName == req.params.name)
      {
        flag = true;
      }
    });
    res.json({success:true,flag:flag});
    }
    catch(error){
        console.log(error);
    }
  }

  // Tạo một transporter sử dụng máy chủ SMTP của bạn
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Địa chỉ máy chủ SMTP của bạn
    port: 465, // Cổng SMTP (ví dụ: 465 cho SSL, 587 cho TLS)
    secure: true, // true nếu sử dụng SSL, false nếu sử dụng TLS
    auth: {
      user: 'ngothibaolinhnm2003@gmail.com', // Email của bạn
      pass: 'ihtfmeaaasyxiidr', // Mật khẩu của bạn
    },
  });
  
  // Hàm gửi email
  const sendEmail = async (req,res) => {
    try {
      const data = req.body;
      await transporter.sendMail({
        from: 'ngothibaolinhnm2003@gmail.com',
        to:'ngothibaolinhnm2003@gmail.com',
        subject:'Ứng dụng quản lý Phòng mạch tư gửi lại mật khẩu',
        text:'111111',
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  module.exports={setUserInfo, addUser, SignIn, sendEmail, checkUserName}