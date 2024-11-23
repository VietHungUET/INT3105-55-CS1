const amqp = require('amqplib');

async function sendToQueue(data, res) {
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_IP}`);
    const channel = await connection.createChannel();
    const taskQueue = 'task_queue';
    const responseQueue = 'response_queue';  // Hàng đợi phản hồi

    await channel.assertQueue(taskQueue, { durable: true });
    await channel.assertQueue(responseQueue, { durable: true });

    // Tạo correlationId duy nhất cho yêu cầu
    const correlationId = generateCorrelationId();

    // Gửi yêu cầu vào hàng đợi task_queue với replyTo là responseQueue và correlationId
    channel.sendToQueue(taskQueue, Buffer.from(JSON.stringify(data)), {
        replyTo: responseQueue,  // Hàng đợi để nhận kết quả
        correlationId: correlationId,  // CorrelationId giúp ghép kết quả
        persistent: true  // Tin nhắn sẽ tồn tại trong hàng đợi khi RabbitMQ khởi động lại
    });

    console.log('Request sent to RabbitMQ with correlationId:', correlationId);

    // Lắng nghe phản hồi từ hàng đợi responseQueue
    channel.consume(responseQueue, (msg) => {
        if (msg.properties.correlationId === correlationId) {
            const result = JSON.parse(msg.content.toString());
            console.log('Received result from consumer:', result);

            // Trả kết quả lại cho client
            res.status(200).json({ shortUrl: `http://${process.env.DOMAIN_APP}/short/${result.shortUrl}` });

            channel.close();
            connection.close();
        }
    }, { noAck: true });
}

function generateCorrelationId() {
    return Math.random().toString(36).substring(7);  // Tạo một ID ngẫu nhiên
}

module.exports = { sendToQueue };
