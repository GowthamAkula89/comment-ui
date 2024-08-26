import React, {useState} from "react";
import "./repliesPagination.css";
import Reaction from "../Reactions/reactions";

const RepliesPagination = ({ replies, commentKey, handleFetch, CommentText }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const repliesPerPage = 8;
  
    // Get the total number of pages
    const totalPages = Math.ceil(Object.keys(replies).length / repliesPerPage);
  
    // Determine the replies to display based on the current page
    const currentReplies = Object.entries(replies).slice(
      (currentPage - 1) * repliesPerPage,
      currentPage * repliesPerPage
    );
  
    return (
      <div className="replies">
        {currentReplies.map(([replyKey, reply]) => (
          <div className="reply" key={replyKey}>
            <div className="user-data">
              <img src={reply.userProfile} alt="user-photo" className="user-img" />
              <div className="user-name">{reply.userName}</div>
            </div>
            <CommentText text={reply.comment} />
            <Reaction
              commentKey={`${commentKey}/replies/${replyKey}`}
              handleFetch={handleFetch}
              comment={reply}
            />
          </div>
        ))}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              &lt;
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default RepliesPagination;