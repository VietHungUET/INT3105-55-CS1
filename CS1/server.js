const express = require('express')
const lib = require('./utils')
const { sequelize } = require('./models/url');
const crypto = require('crypto');
const app = express()
const port = 3001

sequelize.sync().then(() => {
    console.log('Database synced');
}).catch(err => {
    console.error('Unable to sync the database:', err);
});


app.get('/short/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const url = await lib.findOrigin(id);
        if (url == null) {
            res.send("<h1>404</h1>");
        }
        else {
            res.redirect(url);
        }
    } catch (err) {
        res.send(err)
    }
})

app.post('/create', async (req, res) => {
    try {
        const url = req.body.url;
        const newID = await lib.shortUrl(url);
        res.send(newID);

    } catch (err) {
        res.send(err)
    }
});
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Để xử lý body dạng JSON
app.use(express.urlencoded({ extended: true })); // Để xử lý body dạng URL-encoded


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(port, () => {
    console.log(`Example app http://localhost:${port}`);
})
