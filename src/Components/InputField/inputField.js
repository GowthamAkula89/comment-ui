import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./inputField.css";
import { useAuth } from "../../Contexts/AuthContext/authContext";
import addComments from "../../APIs/addComments";
import { setComments } from "../../Redux/Slices/comments.slice";
import { useSnackbar } from "notistack";
import { sortComments } from "../../Utils/sortComments";

const InputField = ({ commentKey, setIsCommentInputOpen }) => {
  const activeSort = useSelector((state) => state.comments.activeSort);
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [commentText, setCommentText] = useState("");
  const [textType, setTextType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [suggestionPosition, setSuggestionPosition] = useState({ left: 0, top: 0 });
  const textareaRef = useRef(null);
  const overlayRef = useRef(null);

  const [image, setImage] = useState(null);

  const comments = useSelector((state) => state.comments.comments);
  const commentedUsers = Object.values(comments).map((comment) => ({
    id: comment.userId,
    name: comment.userName,
  }));

  useEffect(() => {
    if (searchQuery.length > 0) {
      setSuggestedUsers(
        commentedUsers.filter((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, commentedUsers]);

  const handlePost = async () => {
    setIsLoading(true);
    if (!currentUser) {
      enqueueSnackbar("Please login to add comment", { variant: "error" });
      setIsCommentInputOpen(false);
      setIsLoading(false);
      return;
    }

    // Add logic to handle image uploading if necessary
    const resData = await addComments(currentUser, commentKey, commentText, image);
    if (resData) {
      const filterData = sortComments(resData, activeSort);
      dispatch(setComments(filterData));
      setCommentText("");
      setIsCommentInputOpen(false);
      enqueueSnackbar("Replied", { variant: "success" });
    } else {
      enqueueSnackbar("Please provide comment", { variant: "warning" });
    }
    setIsLoading(false);
  };

  const handleTagging = (e) => {
    const input = e.target.value;
    setCommentText(input);

    if (input.includes("@")) {
      setShowSuggestions(true);
      const query = input.split("@").pop();
      setSearchQuery(query.trim());
      positionSuggestions();
    } else {
      setShowSuggestions(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const positionSuggestions = () => {
    if (textareaRef.current && overlayRef.current) {
      const textarea = textareaRef.current;
      const text = textarea.value.substring(0, textarea.selectionStart);

      const tempSpan = document.createElement("span");
      tempSpan.style.position = "absolute";
      tempSpan.style.visibility = "hidden";
      tempSpan.style.whiteSpace = "pre-wrap";
      tempSpan.style.wordWrap = "break-word";
      tempSpan.style.fontFamily = getComputedStyle(textarea).fontFamily;
      tempSpan.style.fontSize = getComputedStyle(textarea).fontSize;
      tempSpan.textContent = text;

      document.body.appendChild(tempSpan);
      const caretPosition = textarea.selectionStart;

      const caretCoords = getCaretCoordinates(tempSpan, caretPosition);
      document.body.removeChild(tempSpan);

      setSuggestionPosition({
        left: caretCoords.left,
        top: caretCoords.top + textarea.scrollTop,
      });
    }
  };

  const getCaretCoordinates = (element, position) => {
    const span = document.createElement("span");
    span.textContent = element.textContent.substring(0, position) || ".";
    element.appendChild(span);

    const coordinates = {
      left: span.offsetLeft,
      top: span.offsetTop,
    };

    element.removeChild(span);
    return coordinates;
  };

  const selectUser = (user) => {
    const textBeforeAt = commentText.split("@").slice(0, -1).join("@");
    setCommentText(`${textBeforeAt}@${user.name} `);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  return (
    <div className="comment-input-field">
      <div ref={overlayRef} className="textarea-overlay"></div>

      <textarea
        ref={textareaRef}
        className={`input-field ${textType}`}
        value={commentText}
        placeholder="Write a comment..."
        onChange={handleTagging}
        onScroll={positionSuggestions}
      />
      {image && <img src={image} alt="Selected" className="image-preview" />}

      {showSuggestions && (
        <div
          className="suggestions-list"
          style={{ left: suggestionPosition.left, top: suggestionPosition.top }}
        >
          {suggestedUsers.map((user) => (
            <div
              key={user.id}
              className="suggestion-item"
              onClick={() => selectUser(user)}
            >
              {user.name}
            </div>
          ))}
        </div>
      )}

      <div className="input-actions">
        <hr />
        <div className="actions">
          <div className="text-styles">
            <div className="bold" onClick={() => setTextType("bold")}>
              B
            </div>
            <div className="italic" onClick={() => setTextType("italic")}>
              I
            </div>
            <div className="underline" onClick={() => setTextType("underline")}>
              U
            </div>
          </div>
          <div className="btns">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-upload-input"
            />
            <button
              className="cancel-btn"
              onClick={() => setIsCommentInputOpen(false)}
            >
              Cancel
            </button>
            <button className="send-btn" onClick={handlePost}>
              {isLoading ? <div className="spinner"></div> : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputField;
