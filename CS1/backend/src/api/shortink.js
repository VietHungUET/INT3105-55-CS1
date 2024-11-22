const express = require('express');
const ShortLinkService = require('../services/short-link-service');
const { BadRequestError } = require('../utils/app-errors');
const { sendToQueue } = require('../queue/producer');
const authMiddleware = require('./middlewares/auth');
const addUserInfoMiddleware = require('./middlewares/userInfo');

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

    app.post('/create', addUserInfoMiddleware, async (req, res) => {
        try {
            const { url } = req.body;
            const userId = req.user && req.user.userId ? req.user.userId : null;

            await sendToQueue({ url, userId }, res);
            // const { shortUrl } = await lib.createShortUrl(url, userId);
            // res.json({ shortUrl: `${req.protocol}://${req.get('host')}/short/${shortUrl}` });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/my-urls', authMiddleware, async (req, res) => {
        try {
            const userId = req.user.userId; // Lấy userId từ req.user (được gán bởi middleware xác thực)
            const urls = await lib.getUserUrls(userId);
            res.json(urls);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.delete('/delete-urls/:id', authMiddleware, async (req, res) => {
        try {
            const { id } = req.params;
            await lib.deleteUrl(id);
            res.status(204).end();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};