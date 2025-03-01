import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser($userName: String!, $email: String!, $password: String!) {
    addUser(userName: $userName, email: $email, password: $password) {
      token
      user {
        _id
        userName
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        userName
      }
    }
  }
`;

export const ADD_TO_FAVORITES = gql`
mutation AddToFavorites($userId: ID!, $drink: String!) {
  addToFavorites(userId: $userId, drink: $drink) {
    _id
    name
    icon
    alcohol {
      name
      amount
      technique
    }
    liquid {
      name
      amount
      technique
    }
    garnish {
      name
      amount
      technique
    }
    assembly
  }
}
`;

export const REMOVE_FAVORITE_DRINK = gql`
  mutation RemoveFavoriteDrink($userId: ID!, $drink: String!) {
    removeFavoriteDrink(userId: $userId, drink: $drink) {
      name
    }
  }
`;

export const ADD_COMMENT_TO_FORMULA = gql`
  mutation AddCommentToFormula($userId: ID!, $formulaId: ID!, $post: String!) {
    addCommentToFormula(userId: $userId, formulaId: $formulaId, post: $post) {
      _id
      name
      comments {
        userName
        post
        timestamp
      }
    }
  }
`;

export const REMOVE_COMMENT_FROM_FORMULA = gql`
mutation RemoveCommentFromFormula($userId: ID!, $commentId: ID!) {
  removeCommentFromFormula(userId: $userId, commentId: $commentId) {
    _id
    comments {
      _id
      userName
      post
      timestamp
    }
  }
}
`;


export const LIKE_DRINK = gql`
  mutation LikeDrink($userId: ID!, $formulaId: ID!) {
    likeDrink(userId: $userId, formulaId: $formulaId) {
      likeCount
    }
  }
`;

export const DISLIKE_DRINK = gql`
  mutation DislikeDrink($userId: ID!, $formulaId: ID!) {
    dislikeDrink(userId: $userId, formulaId: $formulaId) {
      dislikeCount
    }
  }
`;

export const ADD_REPLY_TO_COMMENT = gql`
  mutation AddReplyToComment($commentId: ID!, $userId: ID!, $post: String!) {
    addReplyToComment(userId: $userId, commentId: $commentId, post: $post) {
      _id
      comments {
        _id
        userName
        post
        timestamp
        replies {
          userName
          post
          timestamp
        }
      }
    }
  }
`;

export const EDIT_COMMENT_ON_FORMULA = gql`
  mutation EditCommentOnFormula($userId: ID!, $commentId: ID!, $newPost: String!) {
    editCommentOnFormula(userId: $userId, commentId: $commentId, newPost: $newPost) {
      _id
      comments {
        _id
        userName
        post
        timestamp
      }
    }
  }
`;

export const REMOVE_REPLY_FROM_COMMENT = gql`
  mutation RemoveReplyFromComment($userId: ID!, $commentId: ID!, $replyId: ID!) {
    removeReplyFromComment(userId: $userId, commentId: $commentId, replyId: $replyId) {
      _id
      comments {
        _id
        userName
        post
        replies {
          _id
          userName
          post
          timestamp
        }
    }
  }
}
`;


export const LIKE_COMMENT = gql`
  mutation LIKE_COMMENT($userId: ID!, $commentId: ID!, $replyId: ID) {
    likeComment(userId: $userId, commentId: $commentId, replyId: $replyId) {
      _id
      likeCount
      isLiked
    }
  }
`;