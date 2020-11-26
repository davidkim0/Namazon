const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    login: String,
    password: String,
    cartId: {
        type: mongoose.ObjectId,
        ref: 'Cart'
    }
});

module.exports = mongoose.model('User', userSchema);