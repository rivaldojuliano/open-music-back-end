const  amqp = require('amqplib');

const ProducerService = {
  sendMessage: async (queue, message)=> {
    // eslint-disable-next-line no-undef
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {
      durable: true
    });

    // eslint-disable-next-line no-undef
    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  }
};

module.exports = ProducerService;