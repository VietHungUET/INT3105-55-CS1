const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../db/app.db');
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
});

class ShortLinkService {
    // constructor() {
    //     this.repository = new ServiceRepository();
    // }
    isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    makeID(deci) {
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

    findOrigin(id) {
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

    create(id, url) {
        return new Promise((resolve, reject) => {
            return db.run(`INSERT INTO data VALUES (?, ?)`, [id, url], function (err) {
                if (err) {
                    return reject(err.message);
                }
                return resolve(id);
            });
        });
    }

    getCounter() {
        return new Promise((resolve, reject) => {
            db.get(`SELECT count FROM counter`, (err, row) => {
                if (err) {
                    return reject(err.message);
                }
                resolve(row.count);
            });
        });
    }

    incrementCounter(deci) {
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

    async shortUrl(url) {
        if (!this.isValidURL(url)) {
            throw new Error('Invalid URL');
        }
        let deci = await this.getCounter();
        let newID = this.makeID(deci);
        await this.create(newID, url);
        await this.incrementCounter(deci);
        return newID;
    }
}

module.exports = ShortLinkService;