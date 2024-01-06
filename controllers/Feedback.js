const {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
} = require("firebase/firestore");
const { firebase } = require("../config");
const firestore = getFirestore(firebase);

const addFeedback = async (req, res) => {
  try {
    const myCollection = collection(firestore, "PhanHoi");
    const docRef = await addDoc(myCollection, req.body);
    res.send({
      success: false,
      message: "Feedback added successfully",
      docId: docRef.id,
    });
  } catch (error) {
    console.error("Error adding document feedback: ", error);
    res
      .status(500)
      .json({
        success: false,
        message: "something went wrong when adding feedback",
      });
  }
};

const getAllFeedbacks = async (req, res) => {
  const { sortOrder } = req.query || "desc";
  const myCollection = collection(firestore, "PhanHoi");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });

    const compareDateTimes = (a, b) => {
      let r = new Date(b.ngay) - new Date(a.ngay);
      if (!r) {
        const [hourA, minuteA] = a.gio.split(":").map(Number);
        const [hourB, minuteB] = b.gio.split(":").map(Number);
        if (hourA !== hourB) return hourB - hourA;
        if (minuteA !== minuteB) return minuteB - minuteA;
      } else return r;
    };
    const newList = list.slice().sort((a, b) => {
      if (sortOrder === "asc") {
        return compareDateTimes(b, a);
      } else {
        return compareDateTimes(a, b);
      }
    });

    res.json({ success: true, feedbacks: newList });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "something went wrong when get data from DichVu",
      });
    console.log(error);
    return [];
  }
};

module.exports = { addFeedback, getAllFeedbacks };
