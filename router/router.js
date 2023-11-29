const express = require('express')
const router = express.Router();
const {setUserInfo, addUser, SignIn, sendEmail, checkUserName} = require ('../controllers/User')
//user
router.put('/setUserInfo/:userId', setUserInfo)
router.post('/addUser', addUser)
router.post('/sendEmail', sendEmail)
router.get('/SignIn/:name/:pass',SignIn)
router.get('/checkUserName/:name',checkUserName)
module.exports = router