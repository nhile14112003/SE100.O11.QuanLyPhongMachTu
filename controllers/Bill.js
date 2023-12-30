const {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} = require("firebase/firestore");
const { firebase } = require("../config");
const firestore = getFirestore(firebase);

const getAllBills = async (req, res) => {
  const myCollection = collection(firestore, "HoaDon");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const newList = list.sort((a, b) => a.maHoaDon.localeCompare(b.maHoaDon));
    res.json({ success: true, bills: newList });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong when get data from HoaDon",
    });
    console.log(error);
    return [];
  }
};

const addBill = async (req, res) => {
  try {
    const myCollection = collection(firestore, "HoaDon");
    const docRef = await addDoc(myCollection, req.body);
    console.log("Document bill successfully add!");
    res.send({
      success: true,
      message: "Discount added successfully",
      docId: docRef.id,
    });
  } catch (error) {
    console.error("Error adding document bill: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when adding bill",
    });
  }
};

const updateBill = async (req, res) => {
  try {
    const myCollection = collection(firestore, "HoaDon");
    const docRef1 = doc(myCollection, req.params.billId);
    let data = req.body;
    await updateDoc(docRef1, data);
    console.log("Document bill successfully updated!");
    res.send({ success: true, message: "Document successfully updated!" });
  } catch (error) {
    console.error("Error updating bill document: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when update document",
    });
  }
};

module.exports = { getAllBills, addBill, updateBill };
