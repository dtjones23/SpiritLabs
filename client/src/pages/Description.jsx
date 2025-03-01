import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_FORMULAS } from "../utils/queries";
import { ADD_COMMENT_TO_FORMULA, REMOVE_COMMENT_FROM_FORMULA, EDIT_COMMENT_ON_FORMULA, ADD_REPLY_TO_COMMENT, REMOVE_REPLY_FROM_COMMENT } from "../utils/mutations";
import { useGlobalContext } from "../globalProvider";
import Auth from "../utils/auth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddToFavoritesButton from "../components/addFavorites/AddToFavoritesButton";
import UserReview from "../components/Reviews/UserReview";
import LikeDislikeButtons from "../components/Reviews/Like-Dislike/LikeDislikeButton";
import "../components/Search/FormulaDescription/DrinkPage.css";
import { useParams } from "react-router-dom";

const Description = () => {
  const { drinkId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { formula } = location.state || {};
  const { loading, error, data, refetch } = useQuery(GET_ALL_FORMULAS);
  const [addComment] = useMutation(ADD_COMMENT_TO_FORMULA);
  const [addReplyToComment] = useMutation(ADD_REPLY_TO_COMMENT);
  const [removeComment] = useMutation(REMOVE_COMMENT_FROM_FORMULA);
  const [removeReplyFromComment] = useMutation(REMOVE_REPLY_FROM_COMMENT);
  const [editComment] = useMutation(EDIT_COMMENT_ON_FORMULA);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [comment, setComment] = useState("");
  const { globalState, setGlobalState } = useGlobalContext();
  const userId = Auth.loggedIn() ? Auth.getProfile().data._id : null;
  const isFavorite = globalState.favorites?.includes(formula?.name); 

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const drinkInfo = data.formulas.find((f) => f._id === drinkId);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleGoToLab = () => {
    setGlobalState(formula);
    navigate("/lab", { state: { formula } });
  };

  const capFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Function to handle submitting a comment to the database
  const handleCommentSubmit = async () => {
    try {
      if (!comment.trim()) return;

      await addComment({
        variables: {
          userId,
          formulaId: drinkInfo._id,
          post: comment,
        },
      });

      refetch();
      console.log("Comment added successfully");
      setComment("");
      setShowCommentBox(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle submitting a reply to a comment
  const handleReplySubmit = async (commentId, replyComment) => {
    try {
      if (!replyComment.trim() || !commentId) {
        console.log("Error: Missing replyComment or commentId");
        return;
      }
  
      await addReplyToComment({
        variables: {
          userId,
          commentId,
          post: replyComment,
        },
      });
      
      refetch();
      console.log("Reply added successfully");
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  // Function to handle deleting a comment
  const handleCommentDelete = async (commentId) => {
    try {
      if (!userId) {
        console.error("Missing userId");
        return;
      }
  
      await removeComment({
        variables: {
          userId,
          commentId,
        },
      });
      
      refetch();
      console.log("Comment removed successfully");
    } catch (error) {
      console.error("Error removing comment:", error.message);
    }
  };
  
  // Function to handle editing a comment
  const handleCommentEdit = async (commentId, newPost) => {
    try {
      await editComment({
        variables: {
          userId,
          commentId,
          newPost,
        },
      });
      
      refetch();
      console.log("Comment edited successfully");
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle deleting a reply
  const handleReplyDelete = async (commentId, replyId) => {
    try {
      if (!userId) {
        console.error("Missing userId");
        return;
      }
  
      await removeReplyFromComment({
        variables: {
          userId,
          commentId,
          replyId,
        },
      });
      
      refetch();
      console.log("Reply removed successfully");
    } catch (error) {
      console.error("Error removing reply:", error.message);
    }
  };

  // Function to render the ingredients list
  const IngredientList = ({ label, items }) =>
    items?.length > 0 && (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary.dark" gutterBottom>
          {label}:
        </Typography>
        <Card variant="outlined" sx={{ p: 2, borderRadius: "12px", boxShadow: 1 }}>
          {items.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 1,
                borderBottom: idx !== items.length - 1 ? "1px solid #ddd" : "none",
              }}
            >
              <Typography sx={{ fontSize: "1.2rem", fontWeight: "medium" }}>{capFirstLetter(item.name)}</Typography>
              <Typography sx={{ fontSize: "1.2rem", color: "text.secondary" }}>{item.amount}</Typography>
            </Box>
          ))}
        </Card>
      </Box>
    );
  
  const renderIngredientsList = () => {
    if (!drinkInfo) return null;
  
    return (
      <>
        <IngredientList label="Alcohol" items={drinkInfo.alcohol} />
        <IngredientList label="Liquid" items={drinkInfo.liquid} />
        <IngredientList label="Garnish" items={drinkInfo.garnish} />
      </>
    );
  };
  
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, p: 3 }}>
      {/* Left Section - Drink Image and Info */}
      <Box sx={{ width: { xs: "100%", md: "40%" }, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Back Button & Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  <IconButton onClick={() => navigate(-1)} sx={{ transition: "0.3s", "&:hover": { color: "primary.main" } }}>
    <ArrowBackIcon />
  </IconButton>
  <Typography variant="h4" fontWeight="bold">
    {formula?.name}
  </Typography>
  <Box>
    {userId && (
      <AddToFavoritesButton
        drinkName={drinkInfo?.name}
        userId={userId}
        isFavorite={isFavorite}
        onSuccess={() => {}}
      />
    )}
  </Box>
</Box>
  
        {/* Drink Image */}
        <Box
          className="drinkCardIcon"
          sx={{
            height: 550,
            backgroundImage: `
              url('/assets/drinkimages/${formula.name.toLowerCase().replace(/\s+/g, "")}.jpeg'),
              url('/assets/drinkimages/${formula.name.toLowerCase().replace(/\s+/g, "")}.webp'),
              url('/assets/drinkimages/${formula.name.toLowerCase().replace(/\s+/g, "")}.png')
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "20px",
            boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.3)",
            transition: "0.3s ease-in-out",
            "&:hover": { transform: "scale(1.02)" },
          }}
        />
  
        {/* Concocted By & Like/Dislike */}
        <CardContent sx={{ width: "90%", mx: "auto", textAlign: "center" }}>
          <Typography variant="h6" fontWeight="medium">
            Concocted by: <strong>Spirit Labs</strong>
          </Typography>
          <Box display="flex" justifyContent="center" mt={1}>
            <LikeDislikeButtons
              userId={userId}
              formulaId={drinkInfo?._id}
              initialLikeCount={drinkInfo?.likeCount || 0}
              initialDislikeCount={drinkInfo?.dislikeCount || 0}
            />
          </Box>
        </CardContent>
      </Box>
  
      {/* Right Section - Tabs and Details */}
      <Box
        sx={{
          flex: 1,
          borderRadius: "15px",
          border: "2px solid",
          borderColor: "primary.main",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "background.paper",
          boxShadow: 3,
          p: 3,
          marginBottom: 2
        }}
      >
        {/* Tabs Navigation */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          sx={{
            mb: 2,
            "& .MuiTabs-indicator": { backgroundColor: "primary.main" },
            "& .MuiTab-root": { fontWeight: "bold", fontSize: "1.1rem", transition: "0.3s", "&:hover": { color: "primary.main" } },
          }}
        >
          <Tab label="Ingredients" />
          <Tab label="Reviews" />
          <Tab label="Instructions" />
        </Tabs>
  
        {/* Tab Content */}
        <Box
          sx={{
            padding: "20px",
            width: "90%",
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Ingredients Tab */}
          {tabIndex === 0 && <Box>{renderIngredientsList()}</Box>}
  
          {/* Reviews Tab */}
                {tabIndex === 1 && (
                <Box>

                  {drinkInfo?.comments?.length > 0 ? (
                  <UserReview
                    reviews={drinkInfo.comments}
                    formulaId={drinkInfo._id}
                    handleCommentDelete={handleCommentDelete}
                    handleCommentEdit={handleCommentEdit}
                    handleReplySubmit={handleReplySubmit}
                    handleReplyDelete={handleReplyDelete}
                  />
                  ) : (
                  <Typography variant="h5" color="text.secondary" sx={{textAlign: "center"}}>
                    No reviews yet. Be the first to write one -
                    only allowed by members of course.
                  </Typography>
                  )}
            
                  {/* Add Review Section */}
                  {userId && (
                  <Box mt={2} p={2} borderRadius="10px" boxShadow={1} bgcolor="background.default">
                    {!showCommentBox ? (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => setShowCommentBox(true)}
                      sx={{ py: 1.5, fontWeight: "bold" }}
                    >
                      Write a Review
                    </Button>
                    ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                      <TextField
                      label="Write a review"
                      multiline
                      rows={4}
                      variant="outlined"
                      fullWidth
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      />
                      <Box display="flex" justifyContent="space-between">
                      <Button variant="contained" color="primary" onClick={handleCommentSubmit} sx={{ flex: 1, mr: 1 }}>
                        Submit Review
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={() => setShowCommentBox(false)} sx={{ flex: 1 }}>
                        Cancel
                      </Button>
                      </Box>
                    </Box>
                    )}
                  </Box>
                  )}
                </Box>
                )}
            
                {/* Instructions Tab */}
          {tabIndex === 2 && (
            <Box>
              <Typography variant="h5" color="text.secondary">
                {drinkInfo.assembly}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}  

export default Description;