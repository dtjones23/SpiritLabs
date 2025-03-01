const mongoose = require ('mongoose');

const { model, Schema } = mongoose;

const inventorySchema = new Schema ({
    
    name: {
        type: String,
        required: true,
        trim: true,
        unique:true,
    },
    url : {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: false,
    },
    handle :{
        type: String,
        required: true,
        trim: true,
    },
    tags: {
        type: [String],
        required: false,
        trim: true
    },
    proof :{
        type: String,
        required: false,
    },
    image : {
        type: String,
        required: false,
    },
    icon:{
        type:Number,
        required: false,
    },
    price: {
        type:String,
        required:false,
        trim: true,
    }
})

const Inventory = model('Inventory', inventorySchema); 

module.exports = Inventory;