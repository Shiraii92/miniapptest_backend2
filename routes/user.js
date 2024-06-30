var express = require('express');
var router = express.Router();
const User = require("../models/user");
const Women = require("../models/women");
const Bet = require("../models/bet");
const { getGameStatus, getCurrentRound } = require('../server/game');


router.get('/getGameStatus', async function (req, res, next) {
    try {
        const gameStatus = await getGameStatus();
        const currentRound = await getCurrentRound();
        res.send({ gameStatus: gameStatus, currentRound: currentRound });
    } catch (error) {
        res.status(500).send("Error fetching game status");
    }
});

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
            const womens = await Women.getAllWomens();
            res.send({ userInfo: returnData, gameStatus: gameStatus, currentRound: round, womens: womens });
        }
    } else {
        const gameStatus = await getGameStatus();
        const round = await getCurrentRound();
        const womens = await Women.getAllWomens();
        res.send({ userInfo: userData, gameStatus: gameStatus, currentRound: round, womens: womens });
    }
});


router.post('/selectTopPick', async function (req, res, next) {
    const { womenId, username } = req.body;
    try {
        var userData = await User.setTopPick(username, womenId);
        if(userData == null) res.status(500).send("Failed to set top pick");
        else res.send(userData);
    } catch (error) {
        console.error('Error setting top pick:', error);
        res.status(500).send("Error setting top pick");
    }
});

router.get('/addVote', async function (req, res, next) {
    const womenId = req.query.womenId;
    const username = req.query.username;
    const returnData = await User.addPoint(username, womenId);
    await Women.addVote(womenId);
    res.send(returnData);
});

router.post('/updatePoints', async function (req, res, next) {
    const { id, points } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        user.point = points;
        await user.save();
        res.send(user);
    } catch (error) {
        console.error('Error updating points:', error);
        res.status(500).send("Error updating points");
    }
});

router.post('/bet', async function (req, res, next) {
    const { username, womenId, point } = req.body;
    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const points = parseInt(point);
        if (user.point < points) {
            return res.status(400).send("Insufficient points");
        }

        // Remove the points from user
        user.point -= points;
        await user.save();

        // Add the bet
        const newBet = await Bet.addBet(username, points, womenId);

        // Return updated user points and bet
        const updatedUser = await User.findByUsername(username);
        res.send({ point: updatedUser.point, bets: newBet });
    } catch (error) {
        console.error('Error placing bet:', error);
        res.status(500).send("Error placing bet");
    }
});

module.exports = router;
