const redis =require("express-redis-cache")

const radiscache=redis({

    port:6379,
    host:"localhost",
    prefix:"ShortUrl",
    // 3600 sec = 1 hour
    expire:60*60
}
)
radiscache.on('connected', () => {
    console.log('Redis cache connected');
});

radiscache.on('error', (error) => {
    console.error('Redis cache error:', error);
});



module.exports=radiscache

