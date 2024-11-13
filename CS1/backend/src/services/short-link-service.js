const { models: { ShortenedURL } } = require('../database/models');
const { shortUrl } = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors');

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
            return { shortUrl: newID };
        } catch (err) {
            throw new APIError('Error creating short URL', err);
        }
    }

    async getOriginalUrl(shortenedUrl) {
        try {
            const record = await ShortenedURL.findOne({ where: { shortenedUrl } });

            if (!record) {
                throw new BadRequestError('URL not found');
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