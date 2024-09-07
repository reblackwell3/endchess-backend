import * as amqp from 'amqplib';

async function connectAndPublish(
  otherPlatform: string,
  otherUsername: string,
  providerId: string,
) {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Declare a queue
    const queue = 'import_games_queue';
    await channel.assertQueue(queue, { durable: true });

    const message = { otherPlatform, otherUsername, providerId };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log('Message published successfully.');

    // Close the connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

export default connectAndPublish;
