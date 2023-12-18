const { getFirestore, collection, getDocs, addDoc, updateDoc, doc, setDoc,getDoc, deleteDoc} = require('firebase/firestore');
const {firebase} = require('../config')
const firestore = getFirestore(firebase);

const addMaterial = async (req, res) => {
    try {
      const myCollection = collection(firestore, 'VatTu');
      const docRef = await addDoc(myCollection, req.body);
      console.log("Document material successfully add!");
      res.send({ success: false, message: 'Material added successfully', docId: docRef.id });
    } catch (error) {
      console.error("Error adding document material: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when adding material'});
    }
};
const getAllMaterials = async (req, res) => {
    const myCollection = collection(firestore, 'VatTu');
    try{
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
    const newList = list.sort((a, b) => a.maVatTu.localeCompare(b.maVatTu));
    res.json({success:true, materials:newList});
    }
    catch(error){
        res.status(500).json({success:false, message: 'something went wrong when get data from VatTu'})
        console.log(error);
        return [];
    }
};
const updateMaterial = async (req, res) => {
    try {
      const myCollection = collection(firestore, 'VatTu');
      const docRef1 = doc(myCollection, req.params.materialId);
      let data = req.body;
      await updateDoc(docRef1, data);
      console.log("Document material successfully updated!");
      res.send({ success:true, message: 'Document successfully updated!' });
    } catch (error) {
      console.error("Error updating material document: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when update document' });
    }
};
const deleteMaterial = async (req, res) => {
    try {
      const documentRef = doc(firestore, 'VatTu', req.params.materialId);
      await deleteDoc(documentRef);
      console.log('Document material deleted successfully.');
      res.send({ success:true, message: 'Document successfully updated!' });
    } catch (error) {
      console.log('Error deleting material document:', error);
      res.status(500).json({ success: false, message: 'something went wrong when delete document' });
    }
};
function compareDates(dateString1, dateString2) {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  if (date1 < date2) {
    return -1; // dateString1 là ngày trước dateString2
  } else if (date1 > date2) {
    return 1; // dateString1 là ngày sau dateString2
  } else {
    return 0; // Hai ngày bằng nhau
  }
}

const getMaterialsBySearch = async (req, res) => {
  const { maVatTu, tenVatTu, slnDau, slnCuoi, sltkDau, sltkCuoi, giaDau, giaCuoi, ngayDau, ngayCuoi } = req.query;
  const myCollection = collection(firestore, 'VatTu');
    try{
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
    const searchResults = list.filter((vatTu) => {
      const normalizeText = (text) => text.toLowerCase();
    
      const matchMaVatTu = maVatTu === '' || normalizeText(vatTu.maVatTu).includes(normalizeText(maVatTu));
      const matchTenVatTu = tenVatTu === '' || normalizeText(vatTu.tenVatTu).includes(normalizeText(tenVatTu));
      
      const matchGiaNhap =
      (giaDau == '' && giaCuoi == '') ||
      (giaDau != '' && parseFloat(vatTu.donGiaNhap) >= parseFloat(giaDau) && giaCuoi == '') ||
      (giaCuoi != '' && parseFloat(vatTu.donGiaNhap) <= parseFloat(giaCuoi) && giaDau == '')||
      (giaDau != '' && giaCuoi != '' &&
        parseFloat(vatTu.donGiaNhap) >= parseFloat(giaDau) &&
        parseFloat(vatTu.donGiaNhap) <= parseFloat(giaCuoi));

      const matchSoLuongNhap =
        (slnDau == '' && slnCuoi == '') ||
        (slnDau != '' && parseFloat(vatTu.soLuongNhap) >= parseFloat(slnDau) && slnCuoi == '') ||
        (slnCuoi != '' && parseFloat(vatTu.soLuongNhap) <= parseFloat(slnCuoi) && slnDau == '')||
        (slnDau != '' && slnCuoi != '' &&
          parseFloat(vatTu.soLuongNhap) >= parseFloat(slnDau) &&
          parseFloat(vatTu.soLuongNhap) <= parseFloat(slnCuoi));

      const matchSoLuongTonKho =
        (sltkDau == '' && sltkCuoi == '') ||
        (sltkDau != '' && parseFloat(vatTu.soLuongTonKho) >= parseFloat(sltkDau) && sltkCuoi == '') ||
        (sltkCuoi != '' && parseFloat(vatTu.soLuongTonKho) <= parseFloat(sltkCuoi) && sltkDau == '')||
        (sltkDau != '' && sltkCuoi != '' &&
          parseFloat(vatTu.soLuongTonKho) >= parseFloat(sltkDau) &&
          parseFloat(vatTu.soLuongTonKho) <= parseFloat(sltkCuoi));
      
      const matchNgayNhap =
        (ngayDau == '' && ngayCuoi == '') ||
        (ngayDau != '' && compareDates(vatTu.ngayNhap, ngayDau) != -1 && ngayCuoi == '') ||
        (ngayCuoi != '' && compareDates(vatTu.ngayNhap, ngayCuoi) != 1 && ngayDau == '')||
        (ngayDau != '' && ngayCuoi != '' &&
          compareDates(vatTu.ngayNhap, ngayDau) != -1 &&
          compareDates(vatTu.ngayNhap, ngayCuoi) != 1);

      return matchMaVatTu && matchTenVatTu && matchGiaNhap && matchSoLuongNhap && matchSoLuongTonKho && matchNgayNhap;
    });
    const sortList = searchResults.sort((a, b) => a.maVatTu.localeCompare(b.maVatTu));
    res.json({success:true, materials:sortList});
    }
    catch(error){
        res.status(500).json({success:false, message: 'something went wrong when get data from VatTu'})
        console.log(error);
        return [];
    }
}

const addDrug = async (req, res) => {
    try {
      const myCollection = collection(firestore, 'Thuoc');
      const docRef = await addDoc(myCollection, req.body);
      console.log("Document drug successfully add!");
      res.send({ success: false, message: 'Drug added successfully', docId: docRef.id });
    } catch (error) {
      console.error("Error adding document drug: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when adding drug'});
    }
};
const getAllDrugs = async (req, res) => {
    const myCollection = collection(firestore, 'Thuoc');
    try{
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
    const newList = list.sort((a, b) => a.maThuoc.localeCompare(b.maThuoc));
    res.json({success:true, drugs:newList});
    }
    catch(error){
        res.status(500).json({success:false, message: 'something went wrong when get data from Thuoc'})
        console.log(error);
        return [];
    }
};
const updateDrug = async (req, res) => {
    try {
      const myCollection = collection(firestore, 'Thuoc');
      const docRef1 = doc(myCollection, req.params.drugId);
      let data = req.body;
      await updateDoc(docRef1, data);
      console.log("Document drug successfully updated!");
      res.send({ success:true, message: 'Document successfully updated!' });
    } catch (error) {
      console.error("Error updating drug document: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when update document' });
    }
};
const deleteDrug = async (req, res) => {
    try {
      const documentRef = doc(firestore, 'Thuoc', req.params.drugId);
      await deleteDoc(documentRef);
      console.log('Document drug deleted successfully.');
      res.send({ success:true, message: 'Document successfully updated!' });
    } catch (error) {
      console.log('Error deleting drug document:', error);
      res.status(500).json({ success: false, message: 'something went wrong when delete document' });
    }
};
const getDrugsBySearch = async (req, res) => {
  const { maThuoc, tenThuoc, slnDau, slnCuoi, sltkDau, sltkCuoi, giaNhapDau, giaNhapCuoi, giaDau, giaCuoi, hsdDau, hsdCuoi, ngayDau, ngayCuoi } = req.query;
  const myCollection = collection(firestore, 'Thuoc');
    try{
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
    const searchResults = list.filter((thuoc) => {
      const normalizeText = (text) => text.toLowerCase();
    
      const matchMaThuoc = maThuoc === '' || normalizeText(thuoc.maThuoc).includes(normalizeText(maThuoc));
      const matchTenThuoc = tenThuoc === '' || normalizeText(thuoc.tenThuoc).includes(normalizeText(tenThuoc));
      
      const matchGiaNhap =
      (giaNhapDau == '' && giaNhapCuoi == '') ||
      (giaNhapDau != '' && parseFloat(thuoc.donGiaNhap) >= parseFloat(giaNhapDau) && giaNhapCuoi == '') ||
      (giaNhapCuoi != '' && parseFloat(thuoc.donGiaNhap) <= parseFloat(giaNhapCuoi) && giaNhapDau == '')||
      (giaNhapDau != '' && giaNhapCuoi != '' &&
        parseFloat(thuoc.donGiaNhap) >= parseFloat(giaNhapDau) &&
        parseFloat(thuoc.donGiaNhap) <= parseFloat(giaNhapCuoi));

      const matchDonGia =
      (giaDau == '' && giaCuoi == '') ||
      (giaDau != '' && parseFloat(thuoc.donGia) >= parseFloat(giaDau) && giaCuoi == '') ||
      (giaCuoi != '' && parseFloat(thuoc.donGia) <= parseFloat(giaCuoi) && giaDau == '')||
      (giaDau != '' && giaCuoi != '' &&
        parseFloat(thuoc.donGia) >= parseFloat(giaDau) &&
        parseFloat(thuoc.donGia) <= parseFloat(giaCuoi));

      const matchSoLuongNhap =
        (slnDau == '' && slnCuoi == '') ||
        (slnDau != '' && parseFloat(thuoc.soLuongNhap) >= parseFloat(slnDau) && slnCuoi == '') ||
        (slnCuoi != '' && parseFloat(thuoc.soLuongNhap) <= parseFloat(slnCuoi) && slnDau == '')||
        (slnDau != '' && slnCuoi != '' &&
          parseFloat(thuoc.soLuongNhap) >= parseFloat(slnDau) &&
          parseFloat(thuoc.soLuongNhap) <= parseFloat(slnCuoi));

      const matchSoLuongTonKho =
        (sltkDau == '' && sltkCuoi == '') ||
        (sltkDau != '' && parseFloat(thuoc.soLuongTonKho) >= parseFloat(sltkDau) && sltkCuoi == '') ||
        (sltkCuoi != '' && parseFloat(thuoc.soLuongTonKho) <= parseFloat(sltkCuoi) && sltkDau == '')||
        (sltkDau != '' && sltkCuoi != '' &&
          parseFloat(thuoc.soLuongTonKho) >= parseFloat(sltkDau) &&
          parseFloat(thuoc.soLuongTonKho) <= parseFloat(sltkCuoi));

      const matchHanSuDung =
        (hsdDau == '' && hsdCuoi == '') ||
        (hsdDau != '' && compareDates(thuoc.hanSuDung, hsdDau) != -1 && hsdCuoi == '') ||
        (hsdCuoi != '' && compareDates(thuoc.hanSuDung, hsdCuoi) != 1 && hsdDau == '')||
        (hsdDau != '' && hsdCuoi != '' &&
          compareDates(thuoc.hanSuDung, hsdDau) != -1 &&
          compareDates(thuoc.hanSuDung, hsdCuoi) != 1);
      
      const matchNgayNhap =
        (ngayDau == '' && ngayCuoi == '') ||
        (ngayDau != '' && compareDates(thuoc.ngayNhap, ngayDau) != -1 && ngayCuoi == '') ||
        (ngayCuoi != '' && compareDates(thuoc.ngayNhap, ngayCuoi) != 1 && ngayDau == '')||
        (ngayDau != '' && ngayCuoi != '' &&
          compareDates(thuoc.ngayNhap, ngayDau) != -1 &&
          compareDates(thuoc.ngayNhap, ngayCuoi) != 1);

      return matchMaThuoc && matchTenThuoc && matchGiaNhap && matchDonGia && matchSoLuongNhap && matchSoLuongTonKho && matchHanSuDung &&matchNgayNhap;
    });
    const sortList = searchResults.sort((a, b) => a.maThuoc.localeCompare(b.maThuoc));
    res.json({success:true, drugs:sortList});
    }
    catch(error){
        res.status(500).json({success:false, message: 'something went wrong when get data from Thuoc'})
        console.log(error);
        return [];
    }
}
module.exports={
    addMaterial, getAllMaterials, updateMaterial, deleteMaterial, getMaterialsBySearch,
    addDrug, getAllDrugs, updateDrug, deleteDrug, getDrugsBySearch
}