const { findOrigin, shortUrl } = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors');

class ShortLinkService {
    constructor() {
        // Bạn có thể thêm các thuộc tính khác nếu cần
    }

    async createShortUrl(url) {
        try {
            if (!url) {
                throw new BadRequestError('URL is required');
            }

            const newID = await shortUrl(url);
            return { shortUrl: newID };
        } catch (err) {
            throw new APIError('Error creating short URL', err);
        }
    }

    async getOriginalUrl(id) {
        try {
            const originalUrl = await findOrigin(id);
            if (!originalUrl) {
                throw new BadRequestError('URL not found');
            }
            return { originalUrl };
        } catch (err) {
            throw new APIError('Error retrieving original URL', err);
        }
    }
}

module.exports = ShortLinkService;