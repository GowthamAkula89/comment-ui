import React, { useEffect, useState } from "react";
import { app } from "../../Firebase/firebase";
import { getDatabase, ref, get } from "firebase/database";
import { useAuth } from "../../Contexts/AuthContext/authContext";
import Reaction from "../Reactions/reactions";
import "./main.css";
import { setComments, setActiveSort } from "../../Redux/Slices/comments.slice";
import { useDispatch, useSelector } from "react-redux";
import addComments from "../../APIs/addComments";
import { useSnackbar } from "notistack";
import RepliesPagination from "../RepliesPagination/repliesPagination";
import { sortComments } from "../../Utils/sortComments";

const Main = () => {
  const { currentUser } = useAuth();
  const comments = useSelector((state) => state.comments.comments);
  const activeSort = useSelector((state) => state.comments.activeSort);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = async () => {
    try {
      const db = getDatabase(app);
      const dbRef = ref(db, "comments");
      const data = await get(dbRef);
      if (data.exists()) {
        const sortedComments = sortComments(data.val(), activeSort);
        dispatch(setComments(sortedComments));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data.");
    }
  };

  const saveData = async () => {
    if (!currentUser) {
      enqueueSnackbar("Please login to add comment", { variant: "error" });
      return;
    }
    const resData = await addComments(currentUser, null, newComment);
    if (resData) {
      dispatch(setComments(resData));
      setNewComment("");
      enqueueSnackbar("Comment added Successfully", { variant: "success" });
    } else {
      enqueueSnackbar("Please provide comment", { variant: "warning" });
    }
    
  };

  
  const handleFilter = (sortOption) => {
    const sortedComments = sortComments(comments, sortOption);
    dispatch(setComments(sortedComments));
    dispatch(setActiveSort(sortOption));
  }
  
  console.log("FIltered", comments)
  return (
    <div className="main">
      <div className="sort-options">
        <button 
          onClick={() => handleFilter("latest")} 
          className={activeSort === "latest" ? "active" : ""}
        >
          Latest
        </button>
        <button 
          onClick={() => handleFilter("popular")} 
          className={activeSort === "popular" ? "active" : ""}
        >
          Popular
        </button>
      </div>
    <div className="comment-input-section">
      {currentUser && (
        <>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="comment-input"
          />
          <button onClick={saveData} className="comment-submit-btn">
            Submit
          </button>
        </>
      )}
    </div>
    {Object.entries(comments).map(([key, comment]) => (
      <div className="comment-container" key={key}>
        <div className="user-data">
          <img src={comment.userProfile} alt="user-photo" className="user-img" />
          <div className="user-name">{comment.userName}</div>
        </div>
        <CommentText text={comment.comment} />
        <Reaction commentKey={key} handleFetch={handleFetch} comment={comment} />
        {comment.replies && (
          <RepliesPagination replies={comment.replies} commentKey={key} handleFetch={handleFetch} CommentText={CommentText}/>
        )}
        {/* {comment.replies &&
          Object.entries(comment.replies).map(([key2, reply2]) => (
            <RepliesPagination replies={reply2.replies} commentKey={key2} handleFetch={handleFetch} CommentText={CommentText}/>
          ))
        } */}
      </div>
    ))}
  </div>
  );
};

const CommentText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const maxCharacterCount = 250;
  const shouldTruncate = text.length > maxCharacterCount;

  return (
    <div className="comment-text">
      {isExpanded || !shouldTruncate ? text : `${text.substring(0, maxCharacterCount)}...`}
      {shouldTruncate && (
        <button onClick={toggleExpanded} className="show-more-less-btn">
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};



export default Main;
