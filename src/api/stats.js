const express = require('express');
const fetch = require('node-fetch');
const html2json = require('html2json').html2json;
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const router = express.Router();

const BASE_URL = 'https://www.gommehd.net';

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100 // limit each IP to 25 requests per minute
});

const speedLimiter = slowDown({
    windowMs: 20 * 1000, // x seconds
    delayAfter: 50, // allow x requests, then...
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

        if (!json || Object.keys(json).length === 0) {
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
    } catch (err) {
        return next(err);
    }

});

router.get('/clan/members/:clanname', limiter, speedLimiter, async (req, res, next) => {

    try {
        //1. get members
        //URLs: https://www.gommehd.net/clan-profile/members-list?clanName=Higher

        const params = new URLSearchParams({
            clanName: req.params.clanname,
        });
        let body = await fetch(`${BASE_URL}/clan-profile/members-list?${params}`);
        body = await body.text();
        const json = getMembers(html2json(body));

        if (!json || Object.keys(json).length === 0) {
            return res.json({
                message: 'No entries found',
                data: {},
            })
        }

        //2. respond to request
        return res.json({
            message: `Members for ${req.params.clanname}`,
            data: json,
        })
    } catch (err) {
        return next(err);
    }

});

router.get('/clan/wars/:clanname', limiter, speedLimiter, async(req, res, next) => {

    try {
        //1. get clanwars
        //URL: https://www.gommehd.net/clan-profile/wars/Higher?game=${game} //bedwars/cores/survivalgames

        //bedwars
        let params = new URLSearchParams({
            game: 'bedwars',
        });
        let body = await fetch(`${BASE_URL}/clan-profile/wars/${req.params.clanname}?${params}`);
        body = await body.text();
        let json = getClanStats(html2json(body), 'bw');
        //cores
        params = new URLSearchParams({
            game: 'cores',
        });
        body = await fetch(`${BASE_URL}/clan-profile/wars/${req.params.clanname}?${params}`);
        body = await body.text();
        json = {...json, ...getClanStats(html2json(body), 'cores')};
        //sg
        params = new URLSearchParams({
            game: 'survivalgames',
        });
        body = await fetch(`${BASE_URL}/clan-profile/wars/${req.params.clanname}?${params}`);
        body = await body.text();
        json = {...json, ...getClanStats(html2json(body), 'sg')};

        if (!json || Object.keys(json).length === 0) {
            return res.json({
                message: 'No entries found',
                data: {},
            })
        }

        //2. respond to request
        return res.json({
            message: `Wars for ${req.params.clanname}`,
            data: json,
        })
    } catch (err) {
        return next(err);
    }

});

function getStats(obj) {
    obj = obj.child[0].child.filter(c => c.tag === 'body')[0].child.filter(c => (c.attr ? c.attr.id === 'content' : false))[0].child[1].child[3].child;
    const res = {}

    obj.forEach(element => {
        if (element.attr && element.attr.class.includes('stat-table')) {
            const game = element.attr.id;
            res[game] = {}
            element.child[1].child[3].child[1].child.forEach(g => {
                if (g.tag === "li") {
                    const score = g.child[1].child[0].text;
                    const type = g.child[4].text;

                    res[game][type.replace('\n', '')] = score;
                }
            });
        }
    });

    return res;
}

function getMembers(obj) {
    const res = {}

    obj.child.forEach(e => {
        if(e.attr && e.attr.class.includes('panel')) {
            const rank = switchRank(e.child.filter(c => c.attr?c.attr.class.includes('panel-heading'):false)[0].child[1].child[0].text);
            res[rank] = []

            e.child.filter(c => c.attr?c.attr.class.includes('panel-body'):false)[0].child[1].child.forEach(m => {
                if(m.attr && m.attr.class.includes('media')) {
                    const player = m.child[3].child[1].child[0].text.replace('\n', '').trim();
                    res[rank].push(player)
                }
            })
        }
    })

    return res;
}

function getClanStats(obj, game) {
    obj = obj.child[0].child.filter(c => c.tag === 'body')[0].child.filter(c => (c.attr ? c.attr.id === 'content' : false))[0].child[1].child[1].child[3].child[1].child[3].child[1];

    const rank = switchRank(obj.child[1].child[1].child[1].child[0].text.trim());
    const points = obj.child[3].child[1].child[1].child[0].text.trim();
    const wins = obj.child[1].child[3].child[1].child[0].text.trim();
    const losses = obj.child[3].child[3].child[1].child[0].text.trim();

    const res = {};
    res[game] = {
            rank, points, wins, losses
    };
    return res;
}

function switchRank(rank) {
    switch(rank) {
        case "Clan Leader": return "leader";
        case "Clan Mods": return "mods";
        case "Clan Member": return "member";
        case "Keiner": return null;
        default: return rank.substring(1);
    }
}

module.exports = router;
