const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    itemName: String,
    quantity: Number,
    description: String
});

module.exports = mongoose.model('Store', storeSchema);