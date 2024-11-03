const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const { APIError } = require('./app-errors');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const dbDirectory = path.resolve(__dirname, '../../db');

if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory);
}
const dbPath = path.resolve(__dirname, '../../db/app.db');
const db = new sqlite3.Database(dbPath);
const min_value = Math.pow(62, 5);
const max_value = Math.pow(62, 6) - 1;

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS data(
            id TEXT,
            url TEXT
        ) STRICT
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS counter(
            count INTEGER
        )
    `, (err) => {
        if (err) {
            console.error("Error creating counter table:", err.message);
        } else {
            db.get(`SELECT count FROM counter`, (err, row) => {
                if (err) {
                    console.error("Error selecting counter value:", err.message);
                }
                if (!row) {
                    db.run(`INSERT INTO counter (count) VALUES (?)`, [min_value]);
                }
            });
        }
    });
    db.run(`
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        ) STRICT
    `);
});


function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

function makeID(deci) {
    var hash_str = "";
    var s_rand = "";
    var s = "012345689abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    while (deci > 0) {
        var b = parseInt(deci % 62);
        var a = s[b] ? s[b] : "";
        hash_str = a + hash_str;
        deci = parseInt(deci / 62);
    }
    for (var i = 0; i < 3; i++) {
        s_rand += s.charAt(Math.floor(Math.random() * s.length));
    }
    hash_str = s_rand + hash_str;
    return hash_str;
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

function getCounter() {
    return new Promise((resolve, reject) => {
        db.get(`SELECT count FROM counter`, (err, row) => {
            if (err) {
                return reject(err.message);
            }
            resolve(row.count);
        });
    });
}

function incrementCounter(deci) {
    return new Promise((resolve, reject) => {
        let newCounter = deci + 1 > max_value ? min_value : deci + 1;
        db.run(`UPDATE counter SET count = ?`, [newCounter], function (err) {
            if (err) {
                return reject(err.message);
            }
            resolve(newCounter);
        });
    });
}

async function shortUrl(url) {
    if (!isValidURL(url)) {
        throw new Error('Invalid URL');
    }
    let deci = await getCounter();
    let newID = makeID(deci);
    await create(newID, url)
    incrementCounter(deci);
    return newID;

}
async function createUser(fullName, phone, password) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO users (fullName, phone, password) VALUES (?, ?, ?)',
            [fullName, phone, password],
            function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.lastID);
            }
        );
    });
}

async function findUserByPhone(phone) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE phone = ?', [phone], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
}
async function GenerateToken(payload) {
    try {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    } catch (error) {
        throw new APIError('Error generating token');
    }
}

async function ValidateToken(token) {
    try {
        if (!token) return false;
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return false;
    }
}

async function ValidateSignature(req) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) return false;

        const token = authorization.split(' ')[1];
        if (!token) return false;

        const decoded = await ValidateToken(token);
        if (!decoded) return false;

        req.user = decoded;
        return true;
    } catch (error) {
        return false;
    }
}
module.exports = {
    findOrigin,
    shortUrl,
    createUser,
    findUserByPhone,
    GenerateToken,
    ValidateToken,
    ValidateSignature
};