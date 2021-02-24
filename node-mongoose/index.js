const mongoose = require('mongoose');
const { findByIdAndUpdate } = require('./models/dishes');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect
.then((db) => {

    console.log('Connected correctly to server');

    Dishes.create({
        name: 'Uthapizza4',
        description: 'test'
    })
    .then(dish => {
        console.log(dish);
        return Dishes.findByIdAndUpdate(
            dish._id, 
            { $set: {description: 'Updated test'} },
            { new: true }
        )
        .exec();
    })
    .then(dish => {
        console.log(dish);

        dish.comments.push({
            rating: 5,
            comment: 'Comment',
            author: 'Greg'
        });

        return dish.save();
    })
    .then((dish) => {
        console.log(dish);
        return Dishes.remove({});
    })
    .then(() => mongoose.connection.close())
    .catch(err => console.log(err));
});