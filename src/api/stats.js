const express = require('express');
const fetch = require('node-fetch');
const html2json = require('html2json').html2json;
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const router = express.Router();

const BASE_URL = 'https://www.gommehd.net/';
 
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 25 // limit each IP to 25 requests per minute
});

const speedLimiter = slowDown({
    windowMs: 20 * 1000, // x seconds
    delayAfter: 10, // allow x requests, then...
    delayMs: 300 // begin adding delay per request
});

router.get('/player/:username', limiter, speedLimiter, async (req, res, next) => {

    try {
        //1. get stats
        //URL looks like this: https://www.gommehd.net/player/index?playerName=Adiber
        const params = new URLSearchParams({
            playerName: req.params.username,
        });
        let body = await fetch(`${BASE_URL}/player/index?${params}`);
        body = await body.text();
        const json = getStats(html2json(body));

        if(Object.keys(json).length === 0) {
            return res.json({
                message: 'No entries found',
                data: {},
            })
        }

        //2. respond to request
        return res.json({
            message: `Results for ${req.params.username}`,
            data: json,
        })
    }catch(err) {
        return next(err);
    }
    
});

router.get('/clan', (req, res) => {

})

function getStats(obj) {
    obj = obj.child[0].child.filter(c => c.tag === 'body')[0].child.filter(c => (c.attr ? c.attr.id === 'content' : false))[0].child[1].child[3].child;
    let res = {}

    obj.forEach(element => {
        if(element.attr && element.attr.class.includes('stat-table')) {
            const game = element.attr.id;
            res[game] = {}
            element.child[1].child[3].child[1].child.forEach(g => {
                if(g.tag === "li") {
                    const score = g.child[1].child[0].text;
                    const type = g.child[4].text;

                    res[game][type.replace('\n', '')] = score;
                }
            });
        }
    });

    return res;
}

module.exports = router;
