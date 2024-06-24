const express = require('express');
const path = require('path');
const fs = require('fs');


const ssrRouter = express.Router();


const staticPath = path.resolve(__dirname, '../../public/index.html');
ssrRouter.use(express.static(staticPath));


ssrRouter.get('/', (req, res) => {
    const indexPath = path.resolve(__dirname, '../../public/index.html');
    fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading index.html file:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.send(data);
    });
});

module.exports = ssrRouter



 
