const express = require('express');
const ShortLinkService = require('../services/short-link-service');
const path = require('path');


module.exports = (app) => {
    const lib = new ShortLinkService();

    app.get('/short/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const url = await lib.findOrigin(id);
            if (url == null) {
                res.status(404).json({ error: "URL not found" });
            } else {
                res.json({ originalUrl: url });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/create', async (req, res) => {
        try {
            const url = req.body.url;
            const newID = await lib.shortUrl(url);
            res.json({ shortUrl: `${req.protocol}://${req.get('host')}/short/${newID}` });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // app.use(express.static(path.join(__dirname, '../public')));

    // app.get('/', (req, res) => {
    //     res.sendFile(path.join(__dirname, 'public', 'index.html'));
    // });


}