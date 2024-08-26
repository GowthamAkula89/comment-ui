import React, { useState } from "react";
import { getDatabase, ref, get, set } from "firebase/database";
import { app } from "../../Firebase/firebase";
import "./reaction.css";
import InputField from "../InputField/inputField";

const emojiList = {
  thumbsUp: "👍",
  thumbsDown: "👎",
  heart: "❤️",
  devil: "😈",
  laugh: "😂",
};

// function to calculate time difference
const timeAgo = (timestamp) => {
  const now = new Date();
  const secondsAgo = Math.floor((now - new Date(timestamp)) / 1000);

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  }

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} minutes ago`;
  }

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} hours ago`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo} days ago`;
};

const Reaction = ({ commentKey, handleFetch, comment }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedCommentKey, setSelectedCommentKey] = useState(null);
  const [isCommentInputOpen, setIsCommentInputOpen] = useState(false);

  const onEmojiClick = async (emoji) => {
    if (selectedCommentKey) {
      await handleReaction(selectedCommentKey, emoji);
      setShowEmojiPicker(false);
      setSelectedCommentKey(null);
    }
  };

  const handleReaction = async (commentKey, emoji) => {
    try {
      const db = getDatabase(app);
      const commentRef = ref(db, `comments/${commentKey}/reactions/${emoji}`);
      const currentCount = (await get(commentRef)).val() || 0;
      await set(commentRef, currentCount + 1);
      await handleFetch();
    } catch (error) {
      console.error("Error updating reaction:", error);
      alert("Failed to update reaction.");
    }
  };

  const handleCommentInput = () => {
    setIsCommentInputOpen(!isCommentInputOpen);
  };

  return (
    <>
      <div className="comment-reactions">
        <button
          onClick={() => {
            setSelectedCommentKey(commentKey);
            setShowEmojiPicker(!showEmojiPicker);
          }}
          className="emoji-picker-btn"
        >
          😊
        </button>
        {showEmojiPicker && selectedCommentKey === commentKey && (
          <div className="emoji-picker">
            {Object.entries(emojiList).map(([name, emoji]) => (
              <button
                key={name}
                onClick={() => onEmojiClick(name)}
                className="emoji-btn"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        {Object.entries(comment.reactions || {}).map(([emoji, count]) => (
          <span
            key={emoji}
            className="reaction"
            onClick={() => handleReaction(commentKey, emoji)}
          >
            {emojiList[emoji]} {count}
          </span>
        ))}
        <span>|</span>
        <span className="reply-btn" onClick={handleCommentInput}>Reply</span>
        <span>|</span>
        <span>
          {timeAgo(comment.time)}
        </span>
      </div>
      {isCommentInputOpen && (
        <InputField commentKey={commentKey} setIsCommentInputOpen={setIsCommentInputOpen} />
      )}
    </>
  );
};

export default Reaction;
