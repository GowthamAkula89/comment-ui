export const sortComments = (comments, sortOption) => {
    const commentsArray = Object.entries(comments);
  
    if (sortOption === "latest") {
      return Object.fromEntries(commentsArray.sort((a, b) => b[1].time - a[1].time));
    } else if (sortOption === "popular") {
      return Object.fromEntries(
        commentsArray.sort(
          (a, b) =>
            (b[1].replies ? Object.keys(b[1].replies).length : 0) -
            (a[1].replies ? Object.keys(a[1].replies).length : 0)
        )
      );
    }
  
    return comments;
  };