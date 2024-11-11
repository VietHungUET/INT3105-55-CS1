const express = require('express');
const ShortLinkService = require('../services/short-link-service');
const path = require('path');

module.exports = (app) => {
    const lib = new ShortLinkService();

    app.get('/short/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { originalUrl } = await lib.getOriginalUrl(id);
            console.log(originalUrl);
            res.redirect(originalUrl);
        } catch (err) {
            if (err instanceof BadRequestError) {
                res.status(404).json({ error: err.message });
            } else {
                res.status(500).json({ error: err.message });
            }
        }
    });

    app.post('/create', async (req, res) => {
        try {
            const { url } = req.body;
            const { shortUrl } = await lib.createShortUrl(url);
            res.json({ shortUrl: `${req.protocol}://${req.get('host')}/short/${shortUrl}` });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};