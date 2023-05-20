const express = require('express');
const mongoose = require('mongoose');
const Grid = require("gridfs-stream");
const router = express.Router();

const credentials = process.env.PATH_TO_PEM

const connection = mongoose.createConnection(process.env.DB_CONNECTION, { 
    sslKey: credentials,
    sslCert: credentials,
    dbName: process.env.DB_NAME});

let gfs;
connection.once('open', () => {
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection('posts');
});

router.delete('/:filename', async(req, res) => {
    try {
        await gfs.collection('posts').deleteOne({ filename: req.params.filename });
        res.send({
            "message": "deleted"
        });
    } catch (error) {
        console.log('error', error);
        res.send("An error occured.");
    }
});

module.exports = router;
