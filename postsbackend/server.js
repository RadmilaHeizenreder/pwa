const express = require('express');
const cors = require('cors');
const postsRoutes = require('./routes/posts.route');
const uploadRoutes = require('./routes/upload.route');
const downloadRoutes = require('./routes/download.route');
const deleteRoutes = require('./routes/delete.route');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
// enable CORS for all requests
app.use(cors());
app.use('/posts', postsRoutes);
app.use('/upload', uploadRoutes);
app.use('/download', downloadRoutes);
app.use('/delete', deleteRoutes);

// mongoDB connecten
mongoose.connect(process.env.DB_CONNECTION, {
    dbName: process.env.DB_NAME,
    sslKey: process.env.PATH_TO_PEM,
    sslCert: process.env.PATH_TO_PEM,
})
const db = mongoose.connection;
db.on('error', console.error.bind('connection error:'));
db.once('open', () => console.log('connected to database'));


app.listen(PORT, (error) => {
    if(error) {
        console.log('error', error);
    } else {
        console.log(`Server listening on port ${PORT}`);
    }
});

