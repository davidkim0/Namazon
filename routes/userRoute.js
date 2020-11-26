const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const accessTokenSecret = "secret"

const User = require('../model/userModel');
const Cart = require('../model/cartModel');

router.get('/user', async (req, res) => {
    const user = await User.find();
    res.send(user);
});

// get user by id
router.get('/user/:id', async (req, res) => {
    const findUser = await User.findById(req.params.id);
    res.send(findUser ? findUser : 404);
});

router.get('/user/:id/cart', async (req, res) => {
    const findUser = await User.findById(req.params.id);
    if(!findUser) {
        return res.send(404);
    }
    let userCart = findUser.cartId;
    res.send(userCart ? userCart : 404);
});

router.post('/user', async (req, res) => {
    const newCart = await Cart.create({ cartItems:[] });
    const userInfo = req.body;
    userInfo.cartId = newCart;
    const newUser = await User.create(userInfo);
    res.send(newUser ? newUser : 500);

});

router.delete('/user/:id/cart', async (req, res) => {
    let userCart = await User.findById(req.params.id);
    if(!userCart) {
        return res.send(404);
    }
    userCart.cartId.cartItems = [];
    userCart = await userCart.cartId.save();
    res.send(userCart.cartId);
});


router.post('/user/login', async (req, res) => {
    try {
        const {login, password} = req.body;
        const user = await userData.findOne({login, password});

        if (user) {
            const accessToken = jwt.sign({user}, accessTokenSecret);
            res.send({accessToken, user});
        } else {
            res.send(403);
        }
    }
    catch(e){
        return res.status(400).send(e)
    }
})

module.exports = router;