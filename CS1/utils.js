const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/app.db');
const { Url } = require('./models/url');
const crypto = require('crypto');

// Hàm để tạo URL rút gọn, kiểm tra xem URL đã tồn tại chưa
async function shortUrl(originalUrl) {
    // Kiểm tra xem URL đã tồn tại chưa
    const existingUrl = await Url.findOne({ where: { originalUrl } });

    if (existingUrl) {
        // Nếu tồn tại rồi, trả về shortId cũ
        return existingUrl.shortId;
    } else {
        // Nếu chưa tồn tại, tạo một shortId mới
        const shortId = crypto.randomBytes(3).toString('hex');  // Tạo ID 6 ký tự
        const newUrl = await Url.create({ originalUrl, shortId });
        return newUrl.shortId;
    }
}

// Hàm để tìm URL gốc dựa vào shortId
async function findOrigin(shortId) {
    const urlRecord = await Url.findOne({ where: { shortId } });
    return urlRecord ? urlRecord.originalUrl : null;
}

module.exports = {
    shortUrl,
    findOrigin
};


db.run(`
        CREATE TABLE IF NOT EXISTS data(
        id TEXT,
        url TEXT
        ) STRICT
`);

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}
function makeID(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function findOrigin(id) {
    return new Promise((resolve, reject) => {
        return db.get(`SELECT * FROM data WHERE id = ?`, [id], function (err, res) {
            if (err) {
                return reject(err.message);
            }
            if (res != undefined) {
                return resolve(res.url);
            } else {
                return resolve(null);
            }
        });
    });
}

function create(id, url) {
    return new Promise((resolve, reject) => {
        return db.run(`INSERT INTO data VALUES (?, ?)`, [id, url], function (err) {
            if (err) {
                return reject(err.message);
            }
            return resolve(id);
        });
    });
}

async function shortUrl(url) {
    if (!isValidURL(url)) {
        throw new Error('Invalid URL');
    }
    while (true) {
        let newID = makeID(5);
        let originUrl = await findOrigin(newID);
        if (originUrl == null);
        await create(newID, url)
        return newID;
    }
}

module.exports = {
    findOrigin,
    shortUrl
}