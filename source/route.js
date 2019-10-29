// Parameters
const express = require('express');
const dbase = require('../data/db.js');
const route = express.Router();

// POST and GET operations

route.post('/', (req, res) => {
    const {title, content} = req.body;

    if(title && content){
        dbase.insert({title, content})
        .then()
    }
})

// Export operations

module.exports = route;