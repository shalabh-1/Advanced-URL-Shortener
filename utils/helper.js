const { URL, urlSchema } = require("../model/url.js")
const redisClient = require('../config/redisconfig.js');
const detectDeviceType = function (userAgent) {
        if (/mobile/i.test(userAgent)) {
            return 'Mobile';
        } else if (/tablet/i.test(userAgent)) {
            return 'Tablet';
        } else {
            return 'Desktop';
        }
}

const scheduleStatusUpdate = function (urlId) {
    // Schedule to change status after 5 minutes (300000 ms)
            setTimeout(async () => {
            try {
            await URL.findByIdAndUpdate({ _id: urlId }, { Status: "NOT_AVAILABLE" });
                } catch (error) {
            console.error(`Error updating status: ${error}`);
            }
        }, 300000); // 5 minutes
};

    

const topReferrers = async function (REFERRERS_KEY) {
    const referrers = await redisClient.hgetall(REFERRERS_KEY);
    const sortedReferrers = Object.entries(referrers)
        .sort(([, a], [, b]) => b - a) // Fixed the sort method
        .map(([referrer, count]) => ({ referrer, count }));
        
    return sortedReferrers;
};


const calculateVisit=function(user){
        const visitsPerHour = {};
        const visitsPerDay = {};
        user.visitHistory.forEach(visit => {
        const visitTime = new Date(visit.timestamp);
        const hour = visitTime.toISOString().substring(0, 13); 
        const day = visitTime.toISOString().substring(0, 10); 

        visitsPerHour[hour] = (visitsPerHour[hour] || 0) + 1;
        visitsPerDay[day] = (visitsPerDay[day] || 0) + 1;
        
       
    });
    return { visitsPerHour, visitsPerDay }
}

const calculatePieChart = function (user) {
   
        const deviceTypeCounts = user.visitHistory.reduce((acc, visit) => {
        acc[visit.deviceType] = (acc[visit.deviceType] || 0) + 1;
        return acc;
        }, {});

        const totalVisits = user.visitHistory.length;

        const pieChartData = Object.entries(deviceTypeCounts).map(([deviceType, count]) => ({
        deviceType,
        count,
        percentage: ((count / totalVisits) * 100).toFixed(2) // percentage value
    }));
    
    return pieChartData

}


module.exports = {
                  detectDeviceType,
                  scheduleStatusUpdate,
                  topReferrers,
                  calculateVisit,
                  calculatePieChart 
                 }