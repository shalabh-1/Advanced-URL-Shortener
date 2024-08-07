const crypto = require('crypto');
const redisClient = require('../config/redisconfig.js');
const VISITORS_SET_KEY = 'unique_visitors';



async function uniqueVisitors(request, response, next) {

    const visitorId = request.ip;
    const hash = crypto.createHash('sha256').update(visitorId).digest('hex');

    
    try {
        await redisClient.sadd(VISITORS_SET_KEY, hash);
    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" })
    }


    next();
};

module.exports = { uniqueVisitors }
