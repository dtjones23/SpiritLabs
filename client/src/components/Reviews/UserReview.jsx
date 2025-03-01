import React, { useState } from "react";
import {
  Typography,
  Box,
  Avatar,
  IconButton,
  TextField,
  Button,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Auth from "../../utils/auth";
import LikeCommentButton from "./LikeComment/LikeCommentButton";
import "./UserReview.css";  

const UserReview = ({
  reviews,
  handleCommentDelete,
  handleCommentEdit,
  handleReplySubmit,
  handleReplyDelete,
}) => {
  const [editMode, setEditMode] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [replyMode, setReplyMode] = useState(null);
  const [replyComment, setReplyComment] = useState("");
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [likedReplies, setLikedReplies] = useState({});
  const [replyAnchorEl, setReplyAnchorEl] = useState(null);
  const [currentReplyId, setCurrentReplyId] = useState(null);

  // Start editing a review
  const startEditing = (reviewId, post) => {
    setEditMode(reviewId);
    setEditedComment(post);
  };

  // Submit the edited review
  const submitEdit = async (reviewId) => {
    await handleCommentEdit(reviewId, editedComment);
    setEditMode(null);
    setEditedComment("");
  };

  // Open the menu for review actions (Edit/Delete)
  const handleMenuClick = (event, reviewId) => {
    setAnchorEl(event.currentTarget);
    setCurrentReviewId(reviewId);
  };

  // Close the review menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentReviewId(null);
  };

  // Handle the edit action from the menu
  const handleEdit = () => {
    if (currentReviewId) {
      const review = reviews.find((r) => r._id === currentReviewId);
      if (review) {
        startEditing(currentReviewId, review.post);
      }
      handleMenuClose();
    }
  };

  // Handle the delete action from the menu
  const handleDelete = () => {
    if (currentReviewId) {
      handleCommentDelete(currentReviewId);
    }
    handleMenuClose();
  };

  // Start replying to a review
  const handleReplyClick = (reviewId) => {
    setReplyMode(reviewId);
    setCurrentReviewId(reviewId);
    setReplyComment("");
  };

  // Submit the reply
  const handlePostReply = async () => {
    if (!currentReviewId) {
      console.error("Error: currentReviewId is null or undefined.");
      return;
    }

    if (replyComment.trim()) {
      try {
        await handleReplySubmit(currentReviewId, replyComment);
        setReplyMode(null);
        setReplyComment("");
      } catch (error) {
        console.error("Error submitting reply:", error);
      }
    } else {
      console.log("Reply comment is empty.");
    }
  };

  // Delete a reply
  const handleReplyDeleteClick = (commentId, replyId) => {
    handleReplyDelete(commentId, replyId);
  };

  // Toggle replies visibility
  const toggleReplies = (reviewId) => {
    setExpandedReplies((prevState) => ({
      ...prevState,
      [reviewId]: !prevState[reviewId],
    }));
  };

  // Open the menu for reply actions (Delete)
  const handleReplyMenuClick = (event, reviewId, replyId) => {
    setReplyAnchorEl(event.currentTarget);
    setCurrentReplyId(replyId);
    setCurrentReviewId(reviewId);
  };

  // Close the reply menu
  const handleReplyMenuClose = () => {
    setReplyAnchorEl(null);
    setCurrentReplyId(null);
  };

  const open = Boolean(anchorEl);
  const replyMenuOpen = Boolean(replyAnchorEl);

  return (
    <Box
      sx={{
        maxHeight: "54vh",
        overflowY: "auto",
        p: 2,
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {reviews.slice().map((review, reviewIndex) => (
        <Paper
          key={review._id || `review-${reviewIndex}`}
          sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}
        >
          <Box className="reviewContainer">
            <Box className="reviewHeader">
              <Avatar alt={review.userName} sx={{ mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {review.userName}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {review.createdAt}
                </Typography>
              </Box>
              {Auth.loggedIn() &&
              Auth.getProfile().data.userName === review.userName && (
                <Box className="reviewActions">
                  <IconButton
                    onClick={(e) => handleMenuClick(e, review._id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open && currentReviewId === review._id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                </Box>
              )}
            </Box>
  
            <Box className="reviewContent" mt={1}>
              {editMode === review._id ? (
                <Box className="editSection">
                  <TextField
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    className="wordBreak"
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => submitEdit(review._id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setEditMode(null)}
                      sx={{ ml: 2 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body1" className="wordBreak">
                  {review.post}
                </Typography>
                
              )}
            </Box>
  
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              {Auth.loggedIn() && (
                <>
                  <LikeCommentButton
                    commentId={review._id}
                    initialLikeCount={review.likeCount}
                    isInitiallyLiked={review.isLiked}
                  />
                  {replyMode === review._id ? (
                    <Box sx={{ width: "100%", mt: 1, ml: 1 }}>
                      <TextField
                        variant="outlined"
                        multiline
                        rows={2}
                        fullWidth
                        value={replyComment}
                        onChange={(e) => setReplyComment(e.target.value)}
                        placeholder="Write a reply..."
                      />
                      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                        <Button variant="contained" color="primary" onClick={handlePostReply}>
                          Post Reply
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => setReplyMode(null)} sx={{ ml: 2 }}>
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Button variant="text" color="primary" sx={{ ml: 2 }} onClick={() => handleReplyClick(review._id)}>
                      Reply
                    </Button>
                  )}
                </>
              )}
            </Box>
  
            {review.replies && review.replies.length > 0 && (
              <Box className="replyContainer">
                <Button onClick={() => toggleReplies(review._id)}>
                  {expandedReplies[review._id] ? "Hide Replies" : `View Replies (${review.replies.length})`}
                </Button>
  
                {expandedReplies[review._id] &&
                  review.replies.map((reply, replyIndex) => (
                    <Box key={reply._id || `reply-${replyIndex}`} className="replyBox">
                      <Box className="replyHeader">
                        <Avatar alt={reply.userName} sx={{ mr: 2 }} />
                        <Box flex="1">
                          <Typography variant="subtitle2" fontWeight="bold">
                            {reply.userName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            {reply.createdAt}
                          </Typography>
                          <Typography className="wordBreak">{reply.post}</Typography>
                        </Box>
                        {Auth.loggedIn() &&
                          (Auth.getProfile().data.userName === reply.userName ||
                            Auth.getProfile().data.userName === review.userName) && (
                            <Box className="replyActions">
                              <LikeCommentButton
                                commentId={review._id}
                                replyId={reply._id}
                                initialLikeCount={reply.likeCount}
                                isInitiallyLiked={likedReplies[reply._id] || false}
                              />
                              <IconButton onClick={(e) => handleReplyMenuClick(e, review._id, reply._id)}>
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                anchorEl={replyAnchorEl}
                                open={replyMenuOpen && currentReplyId === reply._id}
                                onClose={handleReplyMenuClose}
                              >
                                <MenuItem onClick={() => handleReplyDeleteClick(review._id, reply._id)}>
                                  Delete
                                </MenuItem>
                              </Menu>
                            </Box>
                          )}
                      </Box>
                    </Box>
                  ))}
              </Box>
            )}
          </Box>
        </Paper>
      ))}
    </Box>
  );
  
};

export default UserReview;
