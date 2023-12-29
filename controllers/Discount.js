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

const getAllDiscount = async (req, res) => {
  const myCollection = collection(firestore, "GiamGia");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const newList = list.sort((a, b) => a.TGBatDau.localeCompare(b.TGBatDau));
    res.json({ success: true, discounts: newList });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong when get data from GiamGia",
    });
    console.log(error);
    return [];
  }
};

const addDiscount = async (req, res) => {
  try {
    const myCollection = collection(firestore, "GiamGia");
    const docRef = await addDoc(myCollection, req.body);
    console.log("Document discount successfully add!");
    res.send({
      success: true,
      message: "Discount added successfully",
      docId: docRef.id,
    });
  } catch (error) {
    console.error("Error adding document discount: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when adding discount",
    });
  }
};

const updateDiscount = async (req, res) => {
  try {
    const myCollection = collection(firestore, "GiamGia");
    const docRef1 = doc(myCollection, req.params.discountId);
    let data = req.body;
    await updateDoc(docRef1, data);
    console.log("Document discount successfully updated!");
    res.send({ success: true, message: "Document successfully updated!" });
  } catch (error) {
    console.error("Error updating discount document: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when update document",
    });
  }
};

const deleteDiscount = async (req, res) => {
  try {
    const documentRef = doc(firestore, "GiamGia", req.params.discountId);
    await deleteDoc(documentRef);
    console.log("Document discount deleted successfully.");
    res.send({ success: true, message: "Document successfully updated!" });
  } catch (error) {
    console.log("Error deleting discount document:", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when delete document",
    });
  }
};

const getDiscountsBySearch = async (req, res) => {
  const { maGiamGia } = req.query;
  const myCollection = collection(firestore, "GiamGia");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const searchResults = list.filter((giamgia) => {
      const normalizeText = (text) => text.toLowerCase();

      const matchMaGiamGia =
        maGiamGia === "" ||
        normalizeText(giamgia.maGiamGia).includes(normalizeText(maGiamGia));
      return matchMaGiamGia;
    });
    const sortList = searchResults.sort((a, b) =>
      a.TGBatDau.localeCompare(b.TGBatDau)
    );
    res.json({ success: true, discounts: sortList });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong when get data from GiamGia",
    });
    console.log(error);
    return [];
  }
};

module.exports = {
  getAllDiscount,
  addDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountsBySearch,
};
