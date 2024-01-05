const { getFirestore, collection, getDocs, addDoc, updateDoc, doc, setDoc,getDoc, deleteDoc} = require('firebase/firestore');
const {firebase,admin,db} = require('../config')
const firestore = getFirestore(firebase);

const uploadImage = async(img)=>{
  try{
    if( img == null ) return null;
  const bucket = admin.storage().bucket();
  const timestamp = new Date().getTime().toString();

  // Đường dẫn trong Firebase Storage, ví dụ: 'Photos/photo123.jpg'
  const filePath = `Photos/photo${timestamp}.jpg`;

  // Upload file
  await bucket.upload(img, {
    destination: filePath,
    metadata: {
      contentType: 'image/jpeg'
    }
  });

  // Lấy URL của file đã upload
  const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;

  return fileUrl;
  }
  catch(error){
    console.error("Error upload img: ", error);
    return null
  }
}
const checkThanhToan =async(id)=>{
  const myCollection = collection(firestore, 'HoaDon');
  const docRef = doc(myCollection, id);
  const documentSnapshot = await getDoc(docRef)
  if(documentSnapshot.exists()&&documentSnapshot.data().tinhTrang == 'Đã thanh toán')
  {
    return true
  }
  return false
}
const getListCTHSDT = async (req, res) => {
  const myCollection1 = collection(firestore, 'HoaDon');
  const querySnapshot1 = await getDocs(myCollection1);
  const HoaDon = querySnapshot1.docs.map(x=> {return x.data()})
  const myCollection = collection(firestore, 'ChiTietHSDT');
  try{
  const querySnapshot = await getDocs(myCollection);
  let list = []
   querySnapshot.docs.map(async (doc1) => {
      const data = doc1.data();
      const docId = doc1.id;
      if(data.IDhsdt==req.params.HSId)
      {
      // await checkThanhToan(data.IdHoaDon).then(tt=>{ console.log(tt),list.push({ ...data, Id: docId, edit:tt });})
      // const myCollection1 = collection(firestore, 'HoaDon');
      // const docRef1 = doc(myCollection1, data.IdHoaDon);
      // const documentSnapshot1 = await getDoc(docRef1)
      // if(documentSnapshot1.exists()&&documentSnapshot1.data().tinhTrang == 'Đã thanh toán')
      // {
      //   list.push({ ...data, Id: docId, edit:true })
      // }
      // else list.push({ ...data, Id: docId, edit:false })
      const fil = HoaDon.filter((h)=>h.maCTHSDT==docId)
      if(fil&&fil[0].tinhTrang=='Đã thanh toán'){
        list.push({ ...data, Id: docId, edit:true })
      }
      else list.push({ ...data, Id: docId, edit:false})
      }
    });
    // console.log(list)
  list.sort(function(a, b) {
    if (a.NgayDieuTri > b.NgayDieuTri) {
        return -1; // Trả về số âm để đưa a lên trước b trong mảng
    } else if (a.NgayDieuTri < b.NgayDieuTri) {
        return 1; // Trả về số dương để đưa b lên trước a trong mảng
    } else {
        return 0; // Trả về 0 nếu a và b bằng nhau
    }
});
console.log(list)
  res.json({success:true, cthsdt:list});
  }
  catch(error){
      res.status(500).json({success:false, message: 'something went wrong when get data from getCTHSDT'})
      console.log(error);
      return [];
  }
};
const addHoaDon = async(data, idHSDT)=>{
  try{
    // console.log(data)
    let maHD = 'HD00'
    await db.collection('HoaDon').get().then((snapshot) => {
      const count = snapshot.size + 1;
       maHD = maHD+count
    }).catch((error) => {
      console.log('Lỗi khi đếm số lượng document id:', error);
    });
    const myCollection = collection(firestore, 'HoaDon');  
    const data1 = {...data, maCTHSDT:idHSDT, maHoaDon:maHD}
    const docRef = await addDoc(myCollection, data1);
    const myCollection1 = collection(firestore, 'ChiTietHSDT');
    const docRef1 = doc(myCollection1, idHSDT);
    await updateDoc(docRef1, {IdHoaDon:docRef.id});
  }
  catch(e){
    console.error("Error adding document hoadon: ", error);
  }
}
const countHoaDon = async()=>{
  await db.collection('HoaDon').get().then((snapshot) => {
  const count = snapshot.size + 1;
  console.log(count)
  return count
}).catch((error) => {
  console.log('Lỗi khi đếm số lượng document id:', error);
});
}
const addchitietHSDT =async(req,res)=>{
  try {
    const data = req.body.chitietHSDT
    if(data.AnhSauDieuTri!=null&&data.AnhSauDieuTri.startsWith('uploads')){
      await uploadImage(data.AnhSauDieuTri).then((x)=>{
        data.AnhSauDieuTri = x      
      })
    }
   
    const myCollection = collection(firestore, 'ChiTietHSDT');  
    const docRef = await addDoc(myCollection, data);
    console.log('haha'+docRef.id)
    await addHoaDon(req.body.HoaDon, docRef.id)
    console.log("Document CTHSDT successfully add!");
    res.send({ success: true, message: 'CTHSDT added successfully', docId: docRef.id});
  } catch (error) {
    console.error("Error adding document CTHSDT: ", error);
    res.status(500).json({ success: false, message: 'something went wrong when adding cthsdt'});
  }
}
const updateCTHSDT= async (req, res) => {
  try {
    const myCollection = collection(firestore, 'ChiTietHSDT');
    const docRef1 = doc(myCollection, req.params.Id);
    let data = req.body;
    if(data.AnhSauDieuTri!=null&&data.AnhSauDieuTri.startsWith('uploads')){
      await uploadImage(data.AnhSauDieuTri).then((x)=>{
        data.AnhSauDieuTri = x      
      })
    }
    await updateDoc(docRef1, data);
    console.log("Document cthsdt successfully updated!");
    res.send({ success:true, message: 'Document successfully updated!' });
  } catch (error) {
    console.error("Error updating patient document: ", error);
    res.status(500).json({ success: false, message: 'something went wrong when update document' });
  }
};
const getHSDT = async(req,res)=>{
  try {
    const myCollection = collection(firestore, 'HoSoDieuTri');
    const docRef = doc(myCollection, req.params.IDhsdt);
    const documentSnapshot = await getDoc(docRef);
    if (documentSnapshot.exists()) {
      const data = documentSnapshot.data() || {};
      res.json({success:true, HSDT:data});
    }
  } catch (error) {
    console.error("Error get document hsdt: ", error);
    res.json({success:false, HSDT:{}});
  }
}
const addHSDT =async(data,id)=>{
  try {
    const myCollection = collection(firestore, 'HoSoDieuTri');
    let ma = data.maBenhNhan.replace('BN','HS')
    let tuoi = data.NgaySinh.split('-')
    var now = new Date();
    var currentYear = now.getFullYear();
    const dataHSDT = {
      IDBenhNhan:id,
      MaHSDT:ma,
      MaBenhNhan:data.maBenhNhan,
    }
    const docRef = await addDoc(myCollection, dataHSDT);
    return docRef.id
    console.log("Document HSDT successfully add!");
  } catch (error) {
    console.error("Error adding document patient: ", error);
  }
}
const addPatient = async (req, res) => {
    try {
      const myCollection = collection(firestore, 'BenhNhan');
      const docRef = await addDoc(myCollection, req.body);
      let idHSDT = ''
      await addHSDT(req.body,docRef.id).then((id)=>{
        idHSDT = id
        const docRef1 = doc(myCollection, docRef.id);
        updateDoc(docRef1,{IDhsdt:id})
      })
      console.log("Document patient successfully add!");
      res.send({ success: true, message: 'Staff added successfully', docId: docRef.id, IDhsdt: idHSDT });
    } catch (error) {
      console.error("Error adding document patient: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when adding patient'});
    }
};
const getAllPatients = async (req, res) => {
    const myCollection = collection(firestore, 'BenhNhan');
    try{
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
    const newList = list.sort((a, b) => a.maBenhNhan.localeCompare(b.maBenhNhan));
    res.json({success:true, patients:newList});
    }
    catch(error){
        res.status(500).json({success:false, message: 'something went wrong when get data from BenhNhan'})
        console.log(error);
        return [];
    }
};
const updatePatient= async (req, res) => {
    try {
      const myCollection = collection(firestore, 'BenhNhan');
      const docRef1 = doc(myCollection, req.params.patientId);
      let data = req.body;
      await updateDoc(docRef1, data);
      console.log("Document patient successfully updated!");
      res.send({ success:true, message: 'Document successfully updated!' });
    } catch (error) {
      console.error("Error updating patient document: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when update document' });
    }
};
const deletePatient = async (req, res) => {
    try {
      const documentRef = doc(firestore, 'BenhNhan', req.params.patientId);
      await deleteDoc(documentRef);
      console.log('Document patient deleted successfully.');
      res.send({ success:true, message: 'Document successfully updated!' });
    } catch (error) {
      console.log('Error deleting patient document:', error);
      res.status(500).json({ success: false, message: 'something went wrong when delete document' });
    }
};
const getPatientsBySearch = async (req, res) => {
  const { maBenhNhan, tenBenhNhan, soDienThoai, CCCD } = req.query;
  const myCollection = collection(firestore, 'BenhNhan');
    try{
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
    const searchResults = list.filter((benhnhan) => {
      const normalizeText = (text) => text.toLowerCase();
    
      const matchMaBenhNhan = maBenhNhan === '' || normalizeText(benhnhan.maBenhNhan).includes(normalizeText(maBenhNhan));
      const matchTenBenhNhan = tenBenhNhan === '' || normalizeText(benhnhan.tenBenhNhan).includes(normalizeText(tenBenhNhan));
      const matchsoDienThoai = soDienThoai === '' || normalizeText(benhnhan.soDienThoai).includes(normalizeText(soDienThoai));
      const matchCCCD = CCCD === '' || normalizeText(benhnhan.CCCD).includes(normalizeText(CCCD));
      
    
    
      return matchMaBenhNhan&&matchTenBenhNhan&&matchsoDienThoai&&matchCCCD;
    });
    const sortList = searchResults.sort((a, b) => a.maBenhNhan.localeCompare(b.maBenhNhan));
    res.json({success:true, patients:sortList});
    }
    catch(error){
        res.status(500).json({success:false, message: 'something went wrong when get data from BenhNhan'})
        console.log(error);
        return [];
    }
}
const getCTHSDTsBySearch = async (req, res) => {
  const { MaNhaSi, TenNhaSi, NgayDieuTri, HSDTid} = req.query;
  const myCollection = collection(firestore, 'ChiTietHSDT');
    try{
    const querySnapshot = await getDocs(myCollection);
    const list = []
    querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        if(data.IDhsdt==HSDTid){
        list.push({ ...data, Id: docId });
        }
      });
    const searchResults = list.filter((cthsdt) => {
      const normalizeText = (text) => text.toLowerCase();
    
      const matchMaNhaSi = MaNhaSi === '' || normalizeText(cthsdt.MaNhaSi).includes(normalizeText(MaNhaSi));
      const matchTenNhaSi= TenNhaSi === '' || normalizeText(cthsdt.TenNhaSi).includes(normalizeText(TenNhaSi));
      const matchNgayDieuTri = NgayDieuTri === '' || normalizeText(cthsdt.NgayDieuTri).includes(normalizeText(NgayDieuTri));
 
      return matchMaNhaSi&&matchNgayDieuTri&&matchTenNhaSi;
    });
    const sortList = searchResults.sort((a, b) => a.maBenhNhan.localeCompare(b.maBenhNhan));
    res.json({success:true, cthsdts:sortList});
    }
    catch(error){
        res.status(500).json({success:false, message: 'something went wrong when get data from cthsdt'})
        console.log(error);
        return [];
    }
}
const getPatientData = async (req, res) => {
  try {

    const myCollection = collection(firestore, 'BenhNhan');
    const docRef1 = doc(myCollection, req.params.Id);
    const documentSnapshot = await getDoc(docRef1);

    if (documentSnapshot.exists()) {
      res.send({ success: true, patientData: documentSnapshot.data() });
    } else {
      res.status(404).send({ success: false, message: 'Patient not found' });
    }
  } catch (error) {
    console.error("Error get user document: ", error);
    res.status(500).json({ success: false, message: 'something went wrong when get data from patient' });
  }
};
const deleteCTHSDT = async (req, res) => {
  try {
    const documentRef = doc(firestore, 'ChiTietHSDT', req.params.Id);
    await deleteDoc(documentRef);
    console.log('Document ChiTietHSDT deleted successfully.');
    const documentRef1 = doc(firestore, 'HoaDon', req.params.IdHD);
    await deleteDoc(documentRef1);
    console.log('Document HoaDon deleted successfully.');
    res.send({ success:true, message: 'Document successfully updated!' });
  } catch (error) {
    console.log('Error deleting patient document:', error);
    res.status(500).json({ success: false, message: 'something went wrong when delete document' });
  }
};
module.exports={addPatient, getAllPatients, updatePatient, deletePatient, getPatientsBySearch, getHSDT, addchitietHSDT,updateCTHSDT, getListCTHSDT, getPatientData, deleteCTHSDT, getCTHSDTsBySearch}