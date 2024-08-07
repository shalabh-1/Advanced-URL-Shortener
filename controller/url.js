const nanoId = require('nano-id');
const { URL } = require("../model/url.js");
const { detectDeviceType, scheduleStatusUpdate, topReferrers, calculateVisit, calculatePieChart } = require("../utils/helper.js");
const redisClient = require('../config/redisconfig.js');
const { use } = require('express/lib/application.js');

const VISITORS_SET_KEY = 'unique_visitors';
const REFERRERS_KEY = 'referring_websites';

async function generateNewShortUrl(request, response) {
    try {
        const  url = request.body.url;
       
        

        if (!url) {
            return response.status(400).json({ status:"400",message: "Please provide a URL" });
        }

        const shortCode = nanoId(8);
        const newUrl = await URL.create({
            shortId: shortCode,
            redirectURL: url,
            visitHistory: [],
            count: 0,
        });
        
        // SHORT CODE EXPIRES AFTER 5 MINS
        scheduleStatusUpdate(newUrl._id);

        return response.status(200).json({status:"200",shortId: shortCode });
    } catch (error) {
        
        return response.status(500).json({ status:"500",message: "Internal Server Error" });
    }
}

async function redirectToOriginalUrl(request, response) {
    try {
        const { shortId } = request.params;
        const ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        const userAgent = request.headers['user-agent'];
        const deviceType = detectDeviceType(userAgent);
        const referrer = request.headers['referer'] || 'direct';

        if (!shortId) {
            return response.status(400).json({status:"400", message: 'ShortId is required' });
        }

        const entry = await URL.findOneAndUpdate(
            { shortId, Status: "AVAILABLE" },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                        ipAddress,
                        userAgent,
                        deviceType,
                        referrer
                    }
                },
                $inc: { count: 1 }
            },
            { new: true }
        );

        if (!entry) {
            return response.status(404).json({ status:"404",message: "ShortId not found or may have expired" });
        }

        await redisClient.hincrby(REFERRERS_KEY, referrer, 1);
        return response.status(302).redirect(entry.redirectURL);
       
    } catch (error) {
        console.error('Error redirecting to original URL:', error);
        return response.status(500).json({ status:"500",message: 'Internal Server Error' });
    }
}

async function handleGetAnalytics(request, response) {
    try {
        const { shortId } = request.params;
        const user = await URL.findOne({ shortId });

        if (!user) {
            return response.status(404).json({ status: "404",message:"Short Id Not Found" });
        }

        const uniqueCount = await redisClient.scard(VISITORS_SET_KEY);
        const sortedReferrers = await topReferrers(REFERRERS_KEY);
        const visit = calculateVisit(user);
        const pieChartData = calculatePieChart(user);

        return response.status(200).json({
            status:"200",
            originalUrl: user.redirectURL,
            totalVisits: user.count,
            uniqueVisitors: uniqueCount,
            topReferrers: sortedReferrers,
            visitsPerHour: visit.visitsPerHour,
            visitsPerDay: visit.visitsPerDay,
            pieChartData
        });
    } catch (error) {
        console.error('Error retrieving analytics:', error);
        return response.status(500).json({ status:"500",error: 'Internal Server Error' });
    }
}

module.exports = {
    generateNewShortUrl,
    redirectToOriginalUrl,
    handleGetAnalytics
};
