const { models: { ShortenedURL } } = require('../database/models');
const { shortUrl } = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors');
require('dotenv').config();
const redis = require('redis');
const redisClient = redis.createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
});

redisClient.connect(console.log('Connected to Redis')).catch(console.error);

class ShortLinkService {
    constructor() {
    }

    async createShortUrl(url, userId = null) {
        try {
            if (!url) {
                throw new BadRequestError('URL is required');
            }

            const newID = await shortUrl(url);
            await ShortenedURL.create({ originalUrl: url, shortenedUrl: newID, userId });

            if (redisClient.isReady) {
                redisClient.setEx(newID, 3600, url); // Lưu trữ trong 1 giờ
            }

            return { shortUrl: newID };
        } catch (err) {
            throw new APIError('Error creating short URL', err);
        }
    }

    async getOriginalUrl(shortenedUrl) {
        try {
            // Kiểm tra trạng thái của Redis client trước khi truy vấn Redis
            if (redisClient.isReady) {
                const cachedUrl = await redisClient.get(shortenedUrl);
                if (cachedUrl) {
                    console.log("Cache hit")
                    return { originalUrl: cachedUrl };
                }
            }
            console.log("Cache miss");
            // Nếu không có trong bộ nhớ cache, truy vấn cơ sở dữ liệu
            const record = await ShortenedURL.findOne({ where: { shortenedUrl } });
            if (!record) {
                throw new BadRequestError('URL not found');
            }

            // Lưu trữ kết quả vào bộ nhớ cache nếu Redis client sẵn sàng
            if (redisClient.isReady) {
                redisClient.setEx(shortenedUrl, 3600, record.originalUrl); // Lưu trữ trong 1 giờ
            }

            return { originalUrl: record.originalUrl };
        } catch (err) {
            throw new APIError('Error retrieving original URL', err);
        }
    }


    // Kiểm tra xem URL đã được rút gọn chưa
    async findShortenedURL(originalUrl) {
        try {
            const record = await ShortenedURL.findOne({ where: { originalUrl } });
            return record ? record.shortenedUrl : null;
        } catch (err) {
            throw new APIError('API Error', 'Unable to find shortened URL');
        }
    }
    async getUserUrls(userId) {
        try {
            const urls = await ShortenedURL.findAll({
                where: { userId },
                attributes: { exclude: ['id'] }
            });
            return urls;
        } catch (err) {
            throw new APIError('Error retrieving user URLs', err);
        }
    }
}

module.exports = ShortLinkService;