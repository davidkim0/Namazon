const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    // cart id
    cartItems: [
        {

            storeItemId: {
                type: mongoose.ObjectId,
                ref: 'Store'
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
});

module.exports = mongoose.model('Cart', cartSchema);