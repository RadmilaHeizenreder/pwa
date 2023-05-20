const express = require('express');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {
    if(req.file === undefined) {
        return res.send('You must select a file.');
    }
    else {
        console.log('req.file', req.file);
        const imgUrl = `https://localhost:300/download/${req.file.filename}`;
        return res.status(200).send({
            message: 'File uploaded successfully!',
            url: imgUrl
        });
    }
});

module.exports = router;