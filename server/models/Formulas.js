const mongoose = require ('mongoose');
const commentSchema = require('./Comments');
const { model, Schema } = mongoose;

const formulaSchema = new Schema ({
    name: {
        type: String,
        required: false,
        trim: true,
    },

    type: {
        type:String,
        required:false,
        trim: true,
    },

    glass: {
        type: String,
        required: false,
        trim: true,
    },

    icon: {
        type: String,
        required: false,
        trim: true,
    },

    alcohol: [
        {
            name:{
                type: String,
                required: true,
                trim: true
            },
            amount: {
                type: String,
                required: false,
                trim: true
            },
            technique :{
                type: String,
                required: false,
                trim: true
            }
        }
    ],

    liquid: [
        {
            name:{
                type: String,
                required: false,
                trim: true
            },
            amount: {
                type: String,
                required: false,
                trim: true
            },
            technique :{
                type: String,
                required: false,
                trim: true
            }
        }
    ],

    garnish: [
        {
            name:{
                type: String,
                required: false,
                trim: true
            },
            amount: {
                type: String,
                required: false,
                trim: true
            },
            technique :{
                type: String,
                required: false,
                trim: true
            }
        }
    ],

    assembly: {
        type: String,
        required: false,
        trim: true
    },
    favoritesCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    dislikeCount: {
        type: Number,
        default: 0
    },
        likedBy: [
            {
              type: Schema.Types.ObjectId,
              ref: 'User',
            },
          ],
          dislikedBy: [
            {
              type: Schema.Types.ObjectId,
              ref: 'User',
            },
          ],
          comments: [commentSchema]
})

const Formulas = model('Formulas', formulaSchema); 

module.exports = Formulas;