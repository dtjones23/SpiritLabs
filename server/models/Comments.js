const mongoose = require('mongoose');
const { Schema } = mongoose;

const replySchema = new Schema({
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    post: {
      type: String,
    //   required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  });

const commentSchema = new Schema({
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    post: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    likedBy: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      replies: [replySchema],
  });

module.exports = commentSchema;
