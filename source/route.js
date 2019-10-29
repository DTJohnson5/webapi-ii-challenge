// Parameters
const express = require('express');
const dbase = require('../data/db.js');
const route = express.Router();

// POST and GET operations

route.get('/', (req, res) => {
    dbase.find()
    .then(post => res.status(200).json(post))
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "The post could not be found."})
    })
});

route.get('/:id', (req, res) => {
    const id = req.params.id;
    dbase.findById(id)
    .then((post) => {
        if(post.length > 0){
            res.status(200).json(post);
        } else {
            res.status(404).json({error: "That post does not exist."})
        }
    })
})

route.post('/', (req, res) => {
    const {title, content} = req.body;
    if(title && content){
        dbase.insert({title, content})
        .then(({id}) => {
            dbase.findById(id)
            .then(([post]) => {
                res.status(200).json(post)
            })
        })
    }
    else {
        res.status(400).json({error: "Please enter a title and some content."})
    }
});

route.put('/:id', (req, res) => {
    const {title, content} = req.body;
    const id = req.params.id;

    if (title && content){
        dbase.update(id, {title, content})
        .then(({id}) => {
            dbase.findById(id)
            .then(([post]) => {
                res.status(200).json(post)
            })
        })
    } else {
        res.status(400).json({error: "Please enter a title and some content."})
    }
});

route.delete('/:id', (req, res) => {
    const id = req.params.id;

    dbase.remove(id)
    .then(deleted => {
        if(deleted){
            res.status(200).end();
        } else {
            res.status(404).json({error: "That post ID does not exist."})
        }
    })
    .catch(error => {
        res.status(500).json({error: "The post could not be removed."})
    })

// Export operation

module.exports = route;