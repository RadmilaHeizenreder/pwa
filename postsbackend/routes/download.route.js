const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const router = express.Router();
require('dotenv').config();

const credentials = process.env.PATH_TO_PEM;
const connection = mongoose.createConnection(process.env.DB_CONNECTION, {
    sslKey: credentials,
    sslCert: credentials,
    dbName: process.env.DB_NAME });

let gfs, gfsb;
connection.once('open', () => {
    // initialize stream
    gfsb = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: "posts"
        });
    gfs = Grid(connection.db, mongoose.mongo);
});

router.get('/show/:filename', async(req, res) => {
    try {
        const cursor = await gfs.collection('posts').find({ filename: req.params.filename });
        cursor.forEach(doc => {
            console.log('doc', doc);
            gfsb.openDownloadStream(doc._id).pipe(res);
        })
    } catch (error) {
        console.log('error', error);
        res.send("not found");
    }
});

router.get('/send/:filename', async(req, res) => {
    let fileName = req.params.filename;

    const files = connection.collection('posts.files');
    const chunks = connection.collection('posts.chunks');

    const cursorFiles = files.find({filename: fileName});
    const allFiles = await cursorFiles.toArray();
    const cursorChunks = chunks.find({files_id : allFiles[0]._id});
    const sortedChunks = cursorChunks.sort({n: 1});
    let fileData = [];
    for await (const chunk of sortedChunks) {
        fileData.push(chunk.data.toString('base64'));
    }
    let finalFile = 'data:' + allFiles[0].contentType + ';base64,' + fileData.join('');
    res.send({title: 'Image File', message: 'Image loaded from MongoDB GridFS', imgurl: finalFile});
}) // get

module.exports = router;