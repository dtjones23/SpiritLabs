import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { IconButton, Typography, Box } from "@mui/material";
import { ThumbDownAltOutlined, ThumbUpAltOutlined, ThumbDownAlt, ThumbUpAlt } from "@mui/icons-material";
import { LIKE_DRINK, DISLIKE_DRINK } from "../../../utils/mutations";
import { useGlobalContext } from "../../../globalProvider";
import { GET_ALL_FORMULAS } from "../../../utils/queries";

const LikeDislikeButtons = ({ userId, formulaId }) => {
  const { globalState, setGlobalState } = useGlobalContext();
  const { data, refetch } = useQuery(GET_ALL_FORMULAS);

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  // Retrieve liked and disliked states from globalState
  const liked = globalState[`${formulaId}_liked`] || false;
  const disliked = globalState[`${formulaId}_disliked`] || false;

  useEffect(() => {
    if (data) {
      const formula = data.formulas.find((f) => f._id === formulaId);
      if (formula) {
        setLikeCount(formula.likeCount);
        setDislikeCount(formula.dislikeCount);
      }
    }
  }, [data, formulaId]);

  const [likeDrink] = useMutation(LIKE_DRINK, {
    variables: { userId, formulaId },
    onCompleted: (data) => {
      setLikeCount(data.likeDrink.likeCount);
      setGlobalState((prev) => ({
        ...prev,
        [`${formulaId}_liked`]: true,
        [`${formulaId}_disliked`]: false,
      }));
      refetch(); // Refetch to ensure counts are up-to-date
    },
  });

  const [dislikeDrink] = useMutation(DISLIKE_DRINK, {
    variables: { userId, formulaId },
    onCompleted: (data) => {
      setDislikeCount(data.dislikeDrink.dislikeCount);
      setGlobalState((prev) => ({
        ...prev,
        [`${formulaId}_liked`]: false,
        [`${formulaId}_disliked`]: true,
      }));
      refetch(); // Refetch to ensure counts are up-to-date
    },
  });

  const handleLike = () => {
    if (liked) {
      // If already liked, remove the like
      setGlobalState((prev) => ({
        ...prev,
        [`${formulaId}_liked`]: false,
      }));
      setLikeCount((prevCount) => Math.max(prevCount - 1, 0));
    } else {
      likeDrink();
    }
  };

  const handleDislike = () => {
    if (disliked) {
      // If already disliked, remove the dislike
      setGlobalState((prev) => ({
        ...prev,
        [`${formulaId}_disliked`]: false,
      }));
      setDislikeCount((prevCount) => Math.max(prevCount - 1, 0));
    } else {
      dislikeDrink();
    }
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
        <IconButton onClick={handleLike}>
          {liked ? (
            <ThumbUpAlt sx={{ color: "green" }} />
          ) : (
            <ThumbUpAltOutlined />
          )}
        </IconButton>
        <Typography variant="body2">{likeCount}</Typography>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <IconButton onClick={handleDislike}>
          {disliked ? (
            <ThumbDownAlt sx={{ color: "red" }} />
          ) : (
            <ThumbDownAltOutlined />
          )}
        </IconButton>
        <Typography variant="body2">{dislikeCount}</Typography>
      </Box>
    </Box>
  );
};

export default LikeDislikeButtons;
