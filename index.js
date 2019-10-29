// Data call parameters
const datasource = require('./source/route.js');
const express = require('express');
const server = express();

// Server side data settings
server.use(express.json());
server.use('/api/posts', datasource);
server.listen(3094, () => console.log("You're on server 3094..."));
