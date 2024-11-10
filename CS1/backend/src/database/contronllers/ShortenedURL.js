const ShortenedURL = require('../models/ShortenedURL');

// Create a new shortened URL
async function createShortenedURL(originalUrl, shortenedUrl) {
  return await ShortenedURL.create({ originalUrl, shortenedUrl });
}

// Retrieve the original URL by shortened URL
async function getOriginalURL(shortenedUrl) {
  const record = await ShortenedURL.findOne({ where: { shortenedUrl } });
  return record ? record.originalUrl : null;
}

// Check if a URL has already been shortened
async function findShortenedURL(originalUrl) {
  const record = await ShortenedURL.findOne({ where: { originalUrl } });
  return record ? record.shortenedUrl : null;
}

module.exports = {
  createShortenedURL,
  getOriginalURL,
  findShortenedURL,
};