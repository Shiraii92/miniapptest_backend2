var express = require('express');
var router = express.Router();
const User = require("../models/user");
const Women = require("../models/women");
const Bet = require("../models/bet");
const { getGameStatus, getCurrentRound } = require('../server/game');

router.get('/get', async function (req, res, next) {
    const username = req.query.username;
    var returnData;
    if(username == "") returnData = await User.findAll();
    else returnData = await User.findByUsername(username);
    console.log(returnData);
    if(returnData == null) res.send("No User Exist");
    else res.send(returnData);
});

router.post('/loginUser', async function (req, res, next) {
    const { username, telegramId, first_name, last_name } = req.body;
    var userData = await User.findByUsername(username);
    if(userData == null) {
        var returnData = await User.addUser(username, telegramId, first_name, last_name);
        if(returnData == null) res.status(500).send("Failed to add user");
        else {
            const gameStatus = await getGameStatus();
            const round = await getCurrentRound();
            res.send({ userInfo: returnData, gameStatus: gameStatus, currentRound: round });
        }
    } else {
        const gameStatus = await getGameStatus();
        const round = await getCurrentRound();
        res.send({ userInfo: userData, gameStatus: gameStatus, currentRound: round });
    }
});

router.get('/selectTopPick', async function (req, res, next) {
    const womenId = req.query.womenId;
    const id = req.query.id;
    var userData = await User.setTopPick(id, womenId);
    if(userData == null) res.status(500).send("Failed to set top pick");
    else res.send(userData);
});

router.get('/addVote', async function (req, res, next) {
    const womenId = req.query.womenId;
    const username = req.query.username;
    const returnData = await User.addPoint(username, womenId);
    await Women.addVote(womenId);
    res.send(returnData);
});

router.get('/bet', async function (req, res, next) {
    const womenId = req.query.womenId;
    const username = req.query.username;
    const point = req.query.point;
    const returnData = await User.removeBet(username, point);
    await Bet.addBet(username, point, womenId);
    res.send(returnData);
});

module.exports = router;
