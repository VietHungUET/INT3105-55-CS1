const amqp = require('amqplib');
const ShortLinkService = require('../services/short-link-service');

async function startConsumer() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const taskQueue = 'task_queue';
    const responseQueue = 'response_queue';

    await channel.assertQueue(taskQueue, { durable: true });
    await channel.assertQueue(responseQueue, { durable: true });

    console.log('Consumer waiting for messages...');

    // Prefetch 1 message per worker
    channel.prefetch(1);

    // Xử lý tin nhắn từ task_queue
    channel.consume(taskQueue, async (msg) => {
        const { url, userId } = JSON.parse(msg.content.toString());
        const lib = new ShortLinkService();
        const correlationId = msg.properties.correlationId;

        try {
            const { shortUrl } = await lib.createShortUrl(url, userId);
            console.log(`Processed URL: ${url}, Short URL: ${shortUrl}`);

            // Gửi kết quả về hàng đợi phản hồi với correlationId
            channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify({ shortUrl })), {
                correlationId: correlationId  // CorrelationId giúp ghép kết quả
            });
            channel.ack(msg);  // Xác nhận tin nhắn đã xử lý thành công
        } catch (err) {
            console.error('Error processing message:', err);
            channel.nack(msg);  // Nếu có lỗi, không xác nhận và có thể retry
        }
    });
}

module.exports = { startConsumer };
