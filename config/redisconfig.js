const Redis = require('ioredis');


const redisClient = new Redis({
    host: 'localhost',
    port: 6379,
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = redisClient;


