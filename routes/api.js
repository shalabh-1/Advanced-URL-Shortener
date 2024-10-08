const { Router } = require("express");
const router = Router();
const { generateNewShortUrl, redirectToOriginalUrl, handleGetAnalytics } = require('../controller/url.js');

const radiscache=require("../config/radiscacheconfig.js")
// Define routes
router.post("/shortid",generateNewShortUrl);
router.get('/redirect/:shortId', radiscache.route(),redirectToOriginalUrl);
router.get("/analytics/:shortId",handleGetAnalytics);

module.exports = router;

