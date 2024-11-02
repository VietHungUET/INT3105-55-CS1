const express = require('express')
const lib = require('./utils')
const app = express()
const port = 3001
const path = require('path');

app.use(express.json());

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
