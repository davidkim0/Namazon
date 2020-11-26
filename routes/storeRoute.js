const express = require('express');
const router = express.Router();
const Store = require('../model/storeModel');

router.get('/storeItem/:id', async (req, res) => {
    const storeItem = await Store.findById(req.params.id);

    if(storeItem) {
        if (!req.session.recent10) {
            req.session.recent10 = [storeItem];
        }

        req.session.recent10.push(storeItem);

        if (req.session.recent10.length > 10) {
            req.session.recent10.shift();
        }
        return res.send(storeItem);
    }
    res.send(404);
})

// get 10 recent searches
// storeItem/Recent?num=10
router.get('/storeItem/Recent', (req, res) => {
    return res.send(req.session.recent10 || '');
})

// get all store items or query param
router.get('/storeItem', async (req, res) => {
    const reg = RegExp(req.query.query);
    let foundStoreItems = await Store.find({$or: [{description: reg}, {itemName: reg}]});
    res.send(foundStoreItems ? foundStoreItems : 400);

})

module.exports = router;