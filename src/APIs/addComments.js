import { getDatabase, ref, get, set, push } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../Firebase/firebase";

const addComments = async (currentUser, parentCommentKey = null, newComment, image = null) => {
  if (!newComment.trim() && !image) {
    return;
  }

  try {
    const db = getDatabase(app);
    const storage = getStorage(app);
    let newDocRef;

    if (parentCommentKey) {
      newDocRef = push(ref(db, `comments/${parentCommentKey}/replies`));
    } else {
      newDocRef = push(ref(db, "comments"));
    }

    let imageUrl = null;
    if (image) {
      const imageRef = storageRef(storage, `comments/${newDocRef.key}/image`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef); 
    }

    await set(newDocRef, {
      userName: currentUser.displayName,
      userProfile: currentUser.photoURL,
      comment: newComment,
      time: Date.now(),
      reactions: {},
      replies: {},
      imageUrl: imageUrl || null,
    });

    const dbRef = ref(db, "comments");
    const data = await get(dbRef);
    return data.val();
    
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data: " + error.message);
  }
};

export default addComments;
