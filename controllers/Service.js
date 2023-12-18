const { getFirestore, collection, getDocs, addDoc, updateDoc, doc, setDoc,getDoc, deleteDoc} = require('firebase/firestore');
const {firebase} = require('../config')
const firestore = getFirestore(firebase);

const addService = async (req, res) => {
    try {
      const myCollection = collection(firestore, 'DichVu');
      const docRef = await addDoc(myCollection, req.body);
      console.log("Document service successfully add!");
      res.send({ success: false, message: 'Service added successfully', docId: docRef.id });
    } catch (error) {
      console.error("Error adding document service: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when adding service'});
    }
};
const getAllServices = async (req, res) => {
    const myCollection = collection(firestore, 'DichVu');
    try{
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
    const newList = list.sort((a, b) => a.maDichVu.localeCompare(b.maDichVu));
    res.json({success:true, services:newList});
    }
    catch(error){
        res.status(500).json({success:false, message: 'something went wrong when get data from DichVu'})
        console.log(error);
        return [];
    }
};
const updateService = async (req, res) => {
    try {
      const myCollection = collection(firestore, 'DichVu');
      const docRef1 = doc(myCollection, req.params.serviceId);
      let data = req.body;
      await updateDoc(docRef1, data);
      console.log("Document service successfully updated!");
      res.send({ success:true, message: 'Document successfully updated!' });
    } catch (error) {
      console.error("Error updating service document: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when update document' });
    }
};
const deleteService = async (req, res) => {
    try {
      const documentRef = doc(firestore, 'DichVu', req.params.serviceId);
      await deleteDoc(documentRef);
      console.log('Document service deleted successfully.');
      res.send({ success:true, message: 'Document successfully updated!' });
    } catch (error) {
      console.log('Error deleting service document:', error);
      res.status(500).json({ success: false, message: 'something went wrong when delete document' });
    }
};
const getServicesBySearch = async (req, res) => {
  const { maDichVu, tenDichVu, loaiDichVu, giaDau, giaCuoi } = req.query;
  const myCollection = collection(firestore, 'DichVu');
    try{
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
    const searchResults = list.filter((dichVu) => {
      const normalizeText = (text) => text.toLowerCase();
    
      const matchMaDichVu = maDichVu === '' || normalizeText(dichVu.maDichVu).includes(normalizeText(maDichVu));
      const matchTenDichVu = tenDichVu === '' || normalizeText(dichVu.tenDichVu).includes(normalizeText(tenDichVu));
      const matchLoaiDichVu = loaiDichVu === '' || normalizeText(dichVu.loaiDichVu).includes(normalizeText(loaiDichVu));
      
      const matchGiaThanh =
      (giaDau == '' && giaCuoi == '') ||
      (giaDau != '' && parseFloat(dichVu.giaDichVu) >= parseFloat(giaDau) && giaCuoi == '') ||
      (giaCuoi != '' && parseFloat(dichVu.giaDichVu) <= parseFloat(giaCuoi) && giaDau == '')||
      (giaDau != '' && giaCuoi != '' &&
        parseFloat(dichVu.giaDichVu) >= parseFloat(giaDau) &&
        parseFloat(dichVu.giaDichVu) <= parseFloat(giaCuoi));
    
      return matchMaDichVu && matchTenDichVu && matchLoaiDichVu && matchGiaThanh;
    });
    const sortList = searchResults.sort((a, b) => a.maDichVu.localeCompare(b.maDichVu));
    res.json({success:true, services:sortList});
    }
    catch(error){
        res.status(500).json({success:false, message: 'something went wrong when get data from DichVu'})
        console.log(error);
        return [];
    }
}
module.exports={addService, getAllServices, updateService, deleteService, getServicesBySearch}