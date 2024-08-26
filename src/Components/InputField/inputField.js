import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./inputField.css";
import { useAuth } from "../../Contexts/AuthContext/authContext";
import addComments from "../../APIs/addComments";
import { setComments } from "../../Redux/Slices/comments.slice";
import { useSnackbar } from "notistack";

const InputField = ({ commentKey, setIsCommentInputOpen }) => {
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const [textType, setTextType] = useState("");
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    setIsLoading(true);
    if (!currentUser) {
      enqueueSnackbar("Please login to add comment", {variant:"error"})
      return;
    }

    const resData = await addComments(currentUser, commentKey, commentText);
    dispatch(setComments(resData))
    setCommentText("");
    setIsCommentInputOpen(false);
    setIsLoading(false)
    enqueueSnackbar("Replied", {variant:"success"})
  };

  return (
    <div className="comment-input-field">
      <textarea
        className={`input-field ${textType}`}
        value={commentText}
        placeholder="Write a comment..."
        onChange={(e) => setCommentText(e.target.value)}
      />
      <div className="input-actions">
        <hr />
        <div className="actions">
          <div className="text-styles">
            <div className="bold" onClick={() => setTextType("bold")}>B</div>
            <div className="italic" onClick={() => setTextType("italic")}>I</div>
            <div className="underline" onClick={() => setTextType("underline")}>U</div>
          </div>
          <div className="btns">
            <button className="cancel-btn" onClick={() => setIsCommentInputOpen(false)}>Cancel</button>
            <button className="send-btn" onClick={handlePost}>{isLoading ? <div className="spinner"></div> : "Send"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputField;
