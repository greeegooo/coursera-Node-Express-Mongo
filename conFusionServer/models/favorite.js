const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRef = { type: Schema.Types.ObjectId, ref: 'User' };
const dishRef = { type: Schema.Types.ObjectId, ref: 'Dish' };

const favoriteSchema = new Schema(
    {
        user: userRef,
        dishes: [dishRef]
    },
    {
        timestamps: true
    }
);

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;