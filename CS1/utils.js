const sequelize = require('./database'); // Kết nối tới MySQL
const Url = require('./models/url'); // Import model Url
const crypto = require('crypto');
//const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/app.db');
//const { Url } = require('./models/url');
const crypto = require('crypto');

(async () => {
    try {
      await sequelize.authenticate();
      console.log('Kết nối cơ sở dữ liệu thành công!');
      await sequelize.sync(); // Đồng bộ model với bảng MySQL
      console.log('Đồng bộ model thành công!');
  
      // Chỉ khởi động server khi kết nối thành công
      app.listen(3001, () => {
        console.log('Example ');
      });
    } catch (error) {
      console.error('Không thể kết nối tới cơ sở dữ liệu:', error);
    }
  })();
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

// async function shortUrl(url) {
//     if (!isValidURL(url)) {
//         throw new Error('Invalid URL');
//     }
//     while (true) {
//         let newID = makeID(5);
//         let originUrl = await findOrigin(newID);
//         if (originUrl == null);
//         await create(newID, url)
//         return newID;
//     }
// }

// Hàm tạo URL rút gọn
async function shortUrl(originalUrl) {
    if (!isValidURL(originalUrl)) {
      throw new Error('Invalid URL');
    }
  
    while (true) {
      let shortId = makeID(5);
      const existingUrl = await Url.findOne({ where: { shortId } });
  
      if (!existingUrl) {
        await Url.create({ originalUrl, shortId });
        return shortId;
      }
    }
  }
  
  // Hàm tìm URL gốc dựa vào shortId
  async function findOrigin(shortId) {
    const urlRecord = await Url.findOne({ where: { shortId } });
    return urlRecord ? urlRecord.originalUrl : null;
  }
  

module.exports = {
    findOrigin,
    shortUrl
}