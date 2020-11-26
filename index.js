
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo')(session);
const axios = require('axios');
const accessTokenSecret = "secret"
let cors = require('cors')
const jwt = require('jsonwebtoken');

const storeModel = require('./model/storeModel');
const userModel = require('./model/userModel')
const cartModel = require('./model/cartModel')

const storeRoute = require('./routes/storeRoute');
const userRoute = require('./routes/userRoute');
const cartRoute = require('./routes/cartRoute');

const app = express();
app.use(express.json());


const port = process.env.PORT || 8080;

const url = 'mongodb+srv://user:admin@cluster0.naqhv.mongodb.net/db?retryWrites=true&w=majority';

// axios config
const config = {
    headers: {
        'X-API-KEY': 'b7d0997babac42f989b682b872177c19'
    }
}



const initDB = async () => {
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        app.use(session({
            secret: 'secret',
            store: new mongoStore({mongooseConnection: mongoose.connection})
        }));
        console.log("Connected to Database");
    }).catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
    });
}

const initCarts = async () => {
    const carts = [];
    const storeItems = await storeModel.find({});

    for (let i = 0; i < 50; i++) {
        // get random item
        const item = storeItems[Math.floor(Math.random() * storeItems.length)];
        const newCart = {
            cartItems: [{
                // assign random item to the cart
                storeItemId: item._id,
                quantity: Math.floor(Math.random() * (100 - 1 + 1)) + 1
            }]
        }
        carts.push(newCart);
    }
    cartModel.create(carts);
}

const initUsers = async () => {
    const users = [];
    const firstNames = await axios.get('https://randommer.io/api/Name?nameType=firstname&quantity=50', config);
    const lastNames = await axios.get('https://randommer.io/api/Name?nameType=surname&quantity=50', config);

    const carts = await cartModel.find({});
    firstNames.data.forEach((firstName, i) => {
        const cart = carts[Math.floor(Math.random() * carts.length)];
        const newUser = {
            firstName: firstName,
            lastName: lastNames.data[i],
            email: lastNames.data[i] + firstName + "@gmail.com",
            cartId: cart._id
        }
        users.push(newUser);
    })
    userModel.create(users);
}

const initStore = async () => {
    const items = [];
    const names = await axios.get('https://randommer.io/api/Name/Suggestions?startingWords=a', config);
    const description = await axios.get('https://randommer.io/api/Text/LoremIpsum?loremType=normal&type=paragraphs&number=200\n', config);
    const itemDescription = description.data.split(/, |\. /);

    names.data.forEach((name, i) => {
        const newItem = {
            itemName: name,
            quantity: Math.floor(Math.random() * (250 - 1 + 1)) + 1,
            description: itemDescription[i]

        }
        items.push(newItem);
    })
    await storeModel.create(items);
}


app.use(async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            //Bearer eyJhbGci...
            const jwtToken = authHeader.split(' ')[1];
            const user = jwt.verify(jwtToken, accessTokenSecret);
            req.userJwt = user;
        } else {
            return res.send(401);
        }
    } catch (err) {
        res.send(403);
    }
    next();
})

const populateDB = async () => {
    // await userModel.deleteMany({});
    // await cartModel.deleteMany({});
    // await storeModel.deleteMany({});

    // third
    // await initUsers();
    // second
    // await initCarts();
    // first
   // await initStore();
}


// const init = async () => {
//     await populateDB();
// }
// init();
initDB().then(() => {
    app.use(storeRoute);
    app.use(userRoute);
    app.use(cartRoute);
    app.listen(port);
    console.log(`listening on port ${port}`);
});


