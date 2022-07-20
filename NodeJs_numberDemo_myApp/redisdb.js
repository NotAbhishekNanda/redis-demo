const redis = require('redis');//Configure redis client

const redisClient = redis.createClient();
redisClient.connect().then(() =>{
    console.log('redis connected')
})

module. exports = redisClient;
