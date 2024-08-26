import { getDatabase, ref, get, set, push } from "firebase/database";
import { app } from "../Firebase/firebase";

const addComments = async (currentUser, parentCommentKey = null, newComment) => {
  if (!newComment.trim()) {
    alert("Comment cannot be empty.");
    return;
  }

  try {
    const db = getDatabase(app);
    let newDocRef;

    if (parentCommentKey) {
      newDocRef = push(ref(db, `comments/${parentCommentKey}/replies`));
    } else {
      newDocRef = push(ref(db, "comments"));
    }

    await set(newDocRef, {
      userName: currentUser.displayName,
      userProfile: currentUser.photoURL,
      comment: newComment,
      time: Date.now(),
      reactions: {},
      replies: {}, 
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
