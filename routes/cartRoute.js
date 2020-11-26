const express = require('express');
const router = express.Router();
const Cart = require('../model/cartModel');
const Store = require('../model/storeModel');


router.post('/cart/:cartId/cartItem', async (req, res) => {
    let cart = await Cart.findById(req.params.cartId);

    // check if the cart exists
    if(cart) {
        // check if item already exists in the cart
       const existingItem = cart.cartItems.find(cartItem => {
           return cartItem.storeItemId.toString() == req.body.storeItemId
       });
        // if item exists in cart
        if(existingItem) {
            existingItem.quantity += req.body.quantity;
        }
        else {

            let item = await Store.findById(req.body.storeItemId);
            const newCartItem = {
                storeItemId: item,
                quantity: req.body.quantity
            }
            cart.cartItems.push(newCartItem);
        }
        cart = await cart.save();
        res.send(cart);
    }
    else {
        return res.send(404);
    }
   // res.send(cart ? cart : 500);
});

router.delete('/cart/:cartId/cartItem/:cartItemId', async (req, res) => {
    let cart = await Cart.findById(req.params.cartId);
    if(!cart) {
        return res.send(404);
    }
    const cartItem = cart.cartItems.find(item => {
        return item.id.toString() == req.params.cartItemId;
    });
    if(!cartItem) {
        return res.send(404);
    }
    cart.cartItems.pull(cartItem);
    cart = await cart.save();
    res.send(cart);
});

module.exports = router;