const { Inventory, Formulas, User, Glasses } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    inventory: async () => {
      return Inventory.find({});
    },

    formulas: async () => {
      return Formulas.find({});
    },

    formula: async (parent, { name }) => {
      return Formulas.findOne({ name: name });
    },

    formulasbytype: async (parent, { type }) => {
      return Formulas.find({ type: type });
    },

    formulasbyingredient: async (parent, { terms }) => {
      const regex = terms.map((term) => new RegExp(term, "i")); // this creates an array of regex expressions that are not case sensitive.
      return Formulas.find({
        $or: [
          { "alcohol.name": { $in: regex } },
          { "liquid.name": { $in: regex } },
          { "garnish.name": { $in: regex } },
        ],
      });
    },
    
    glasses: async () => {
      return Glasses.find({})
    },

    inventorybyterms: async (parent, { terms }) => {
      const regex = terms.map((term) => new RegExp(term, "i")); // this creates an array of regex expressions that are not case sensitive.
      return Inventory.find({
        $or: [
          { name: { $in: regex } }, //This will look to see if there is a partial match between the regex object and the name of a inventory object.
          { "tags.type": { $in: regex } },
        ],
      });
    },

    randomDrink: async () => {
      const count = await Formulas.countDocuments(); // get the count of all formulas
      if (count === 0) {
        throw new Error("No formulas available");
      }
      const random = Math.floor(Math.random() * count); // get random number between 0 and count
      return Formulas.findOne().skip(random); // skip to the random number and return that formula
    },
    
    allGlassTypes: async () => {
      const glassTypes = await Formulas.distinct('glass');
      return glassTypes.filter(glass => glass !== null); // Filter out null values if any
    },

    users: async (parent, { userName }) => {
      return User.find();
    },

    user: async (parent, { userName }) => {
      return User.findOne({ userName });
    },
    
    userFavorites: async (parent, { userId }) => {
      try {
        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User does not exist");
        }
    
        // Fetch all favorite drinks with their full formula details
        const favoriteDrinksWithDetails = await Promise.all(
          user.favoriteDrinks.map(async (favoriteDrink) => {
            try {
              // Fetch the full formula for each favorite drink
              const formula = await Formulas.findOne({ name: favoriteDrink.name });
              if (!formula) {
                console.warn(`Formula ${favoriteDrink.name} not found`);
                return null;
              }
              
              // Return the full formula data
              return formula;
            } catch (err) {
              console.error(`Error fetching formula for ${favoriteDrink.name}:`, err);
              return null;
            }
          })
        );
    
        // Filter out any null results
        return favoriteDrinksWithDetails.filter(Boolean);
      } catch (err) {
        console.error(err);
        throw new Error("Failed to get user favorites with full formula details: " + err.message);
      }
    },
    getLikes: async (parent, { formulaId }) => {
      const formula = await Formulas.findById(formulaId);
      if (!formula) {
        throw new Error("Formula not found");
      }
      return formula;
    },
    getDislikes: async (parent, { formulaId }) => {
      const formula = await Formulas.findById(formulaId);
      if (!formula) {
        throw new Error("Formula not found");
      }
      return formula
    }
  },

  Mutation: {
    addUser: async (parent, { userName, email, password }) => {
      // Check if the username already exists
      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        throw new Error("Username already exists");
      }

      // Check if the username is null or empty
      if (!userName) {
        throw new Error("Username cannot be null or empty");
      }

      // Create the new user
      const user = await User.create({ userName, email, password });
      console.log(user);
      const token = signToken(user);
      return { token, user };
    },
    removeUser: async (parent, { userId }, context) => {
      try {
        // Find and remove the user
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
          throw new Error("User not found");
        }

        // Clean up any references to the user in other collections if necessary
        await Formulas.updateMany(
          { likedBy: userId },
          { $pull: { likedBy: userId } }
        );
        await Formulas.updateMany(
          { dislikedBy: userId },
          { $pull: { dislikedBy: userId } }
        );
        await Formulas.updateMany(
          { "comments.userName": user.userName },
          { $pull: { comments: { userName: user.userName } } }
        );

        return { message: "User removed successfully" };
      } catch (err) {
        console.error(err);
        throw new Error("Failed to remove user: " + err.message);
      }
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      console.log(password);

      if (!user) {
        console.log("User not found");
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);
      console.log(correctPw);

      if (!correctPw) {
        console.log("Incorrect password");
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    addToFavorites: async (parent, { userId, drink }) => {
      try {
        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User does not exist");
        }
        
        // Ensure favoriteDrinks is an array
        if (!Array.isArray(user.favoriteDrinks)) {
          user.favoriteDrinks = [];
        }
        
        // Check if the drink is already in the user's favorites list
        const alreadyExists = user.favoriteDrinks.some(fav => fav.name === drink);
        let formula;
    
        if (!alreadyExists) {
          formula = await Formulas.findOne({ name: drink });
          if (!formula) {
            throw new Error("Drink not found");
          }
    
          // Add the full formula to the user's favorites
          user.favoriteDrinks.push(formula);
          await user.save();
    
          // Update the favoritesCount for the drink
          await Formulas.findOneAndUpdate(
            { name: drink },
            { $inc: { favoritesCount: 1 } },
            { new: true }
          );
        }
    
        // Return the formula
        return formula;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to add drink to favorites: " + err.message);
      }
    },
    removeFavoriteDrink: async (parent, { userId, drink }) => {
      try {
        // remove the drink from the user's favorites list in the database
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User does not exist");
        }
        if (!user.favoriteDrinks) {
          user.favoriteDrinks = [];
        }

        // Remove the drink from the favorites list
        user.favoriteDrinks = user.favoriteDrinks.filter(
          (favDrink) => favDrink.name !== drink
        );

        // Save the updated user
        await user.save();
        // Get the current favorites count
        const formula = await Formulas.findOne({ name: drink });
        if (formula && formula.favoritesCount > 0) {
            // we making sure the count can't go below 0
            await Formulas.findOneAndUpdate(
                { name: drink },
                { $inc: { favoritesCount: -1 } },
                { new: true }
            );
        }

        return formula;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to remove drink from favorites" + err.message);
      }
    },
    addCommentToFormula: async (parent, { userId, formulaId, post }) => {
      try {
        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User must be logged in to post a comment");
        }
    
        // Add the comment to the formula
        // We use $push to add the comment to the comments array
        // I will get the timestamp working later as its been giving me issues for whatever the hell reason
        const formula = await Formulas.findByIdAndUpdate(
          formulaId,
          {
            $push: {
              comments: {
                userName: user.userName,
                post: post,
                timestamp: new Date(),
                likeCount: 0,
                isLiked: false, 
                likedBy: [],
              },
            },
          },
          { new: true }
        );
    
        if (!formula) {
          throw new Error("Formula not found");
        }
    
        return formula;
      } catch (error) {
        console.error("Error adding comment to formula:", error);
        throw new Error("Failed to add comment to formula");
      }
    },
    removeCommentFromFormula: async (parent, { userId, commentId }) => {
      try {
        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }
    
        // Find the formula containing the comment
        const formula = await Formulas.findOne({ "comments._id": commentId });
        if (!formula) {
          throw new Error("Formula not found");
        }
    
        // Check if the comment exists and is owned by the user
        const commentIndex = formula.comments.findIndex(
          (comment) => comment._id.toString() === commentId && comment.userName === user.userName
        );
    
        if (commentIndex === -1) {
          throw new Error("Comment not found or not owned by user");
        }
    
        // this will ensure that we remove the comment from the formula
        formula.comments.splice(commentIndex, 1);
        await formula.save();
    
        return formula;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to remove comment: " + err.message);
      }
    },

    removeReplyFromComment: async (parent, { userId, commentId, replyId }) => {
      try {
        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }
    
        // Find the formula containing the comment and the reply
        const formula = await Formulas.findOne({ "comments._id": commentId });
        if (!formula) {
          throw new Error("Formula not found");
        }
    
        // Find the comment
        const comment = formula.comments.id(commentId);
        if (!comment) {
          throw new Error("Comment not found");
        }
    
        // Check if the reply exists
        const reply = comment.replies.id(replyId);
        if (!reply) {
          throw new Error("Reply not found");
        }
    
        // Check if the user is either the owner of the reply or the owner of the comment
        if (reply.userName !== user.userName && comment.userName !== user.userName) {
          throw new Error("You do not have permission to delete this reply");
        }
    
        // Remove the reply using the pull method
        comment.replies.pull(replyId);
        await formula.save();
    
        return formula;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to remove reply: " + err.message);
      }
    },

    likeDrink: async (parent, { formulaId, userId }) => {
      try {
        const formula = await Formulas.findById(formulaId);
        if (!formula) {
          throw new Error("Formula not found");
        }

        const alreadyLiked = formula.likedBy.includes(userId);
        const alreadyDisliked = formula.dislikedBy.includes(userId);

        if (alreadyLiked) {
          // User already liked the drink, so we remove the like
          formula.likeCount -= 1;
          formula.likedBy.pull(userId);
        } else {
          // User is liking the drink
          if (alreadyDisliked) {
            // Remove the dislike if the user previously disliked the drink
            formula.dislikeCount -= 1;
            formula.dislikedBy.pull(userId);
          }
          formula.likeCount += 1;
          formula.likedBy.push(userId);
        }

        await formula.save();
        return formula;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to like drink: " + err.message);
      }
    },

    dislikeDrink: async (parent, { formulaId, userId }) => {
      try {
        const formula = await Formulas.findById(formulaId);
        if (!formula) {
          throw new Error("Formula not found");
        }

        const alreadyDisliked = formula.dislikedBy.includes(userId);
        const alreadyLiked = formula.likedBy.includes(userId);

        if (alreadyDisliked) {
          // User already disliked the drink, so we remove the dislike
          formula.dislikeCount -= 1;
          formula.dislikedBy.pull(userId);
        } else {
          // User is disliking the drink
          if (alreadyLiked) {
            // Remove the like if the user previously liked the drink
            formula.likeCount -= 1;
            formula.likedBy.pull(userId);
          }
          formula.dislikeCount += 1;
          formula.dislikedBy.push(userId);
        }

        await formula.save();
        return formula;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to dislike drink: " + err.message);
      }
    },
    editCommentOnFormula: async (parent, { userId, commentId, newPost }) => {
      try {
        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }

        // Find the formula containing the comment
        const formula = await Formulas.findOne({ "comments._id": commentId });
        if (!formula) {
          throw new Error("Formula not found");
        }

        // Find the comment and ensure it's owned by the user
        const comment = formula.comments.id(commentId);
        if (!comment || comment.userName !== user.userName) {
          throw new Error("Comment not found or not owned by user");
        }

        // Update the comment
        comment.post = newPost;
        await formula.save();

        return formula;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to edit comment: " + err.message);
      }
    },
    addReplyToComment: async (parent, { userId, commentId, post }) => {
      try {
        console.log('Post content:', post);
        if (!post || post.trim() === "") {
          throw new Error("Post content is required for a reply.");
        }
        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User must be logged in to post a comment");
        }
    
        // Find the comment to reply to and push the new reply
        const formula = await Formulas.findOneAndUpdate(
          { 'comments._id': commentId },
          {
            $push: {
              'comments.$.replies': {
                userName: user.userName,
                post: post.trim(),
                timestamp: new Date(),
                likeCount: 0,
                isLiked: false,
                likedBy: [],
              },
            },
          },
          { new: true }
        );
    
        if (!formula) {
          throw new Error("Comment not found");
        }
    
        return formula;
      } catch (error) {
        console.error("Error adding comment to comment:", error);
        throw new Error("Failed to add comment to comment");
      }
  }
,  
likeComment: async (parent, { userId, commentId, replyId }) => {
  try {
    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Find the formula containing the comment
    const formula = await Formulas.findOne({ "comments._id": commentId });
    if (!formula) {
      throw new Error("Formula not found");
    }

    // Find the comment
    const comment = formula.comments.id(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (replyId) {
      // If replyId is provided, find the reply and like it
      const reply = comment.replies.id(replyId);
      if (!reply) {
        throw new Error("Reply not found");
      }

      const alreadyLiked = reply.likedBy.includes(userId);

      if (alreadyLiked) {
        // Remove like
        reply.likeCount -= 1;
        reply.likedBy.pull(userId);
      } else {
        // Add like
        reply.likeCount += 1;
        reply.likedBy.push(userId);
      }
    } else {
      // If no replyId, like the comment itself
      const alreadyLiked = comment.likedBy.includes(userId);

      if (alreadyLiked) {
        comment.likeCount -= 1;
        comment.likedBy.pull(userId);
      } else {
        comment.likeCount += 1;
        comment.likedBy.push(userId);
      }
    }

    await formula.save();
    // Return the comment or reply that was liked
    return replyId ? comment.replies.id(replyId) : comment;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to like comment: " + err.message);
  }
      },
  },
};

module.exports = resolvers;