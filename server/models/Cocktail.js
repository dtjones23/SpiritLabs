const mongoose = require('mongoose');

const cockTailSchema = new mongoose.Schema({
    name: String,
    ingredients: [String],
    Image: String,
});

const Cocktail = mongoose.model('Cocktail', cockTailSchema);