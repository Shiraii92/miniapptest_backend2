const User = require("../models/user")
const Women = require("../models/women")
const Bet = require("../models/bet")
const Game = require("../models/game")
const Round = require("../models/round")



async function InitGamestatus(){
    var gameId = await Game.addNewGame();
    console.log("GAME ID",gameId);
    Round.InitRound(gameId);
}

async function getCurrentRound(){
    var gameId = await Game.getCurrentGameId();
    var round = await Round.getCurrentRound(gameId);
    return round;
}

async function syncTime(){
    var gameId = await Game.getCurrentGameId();
    var round = await Round.syncCurrentRound(gameId);
    return round;
}
async function getGameStatus(){
    var gameId = await Game.getCurrentGameId();
    var rounds = await Round.getRoundsByGameId(gameId);
    var gamestatus = [];
    for(var i=1; i<=rounds.length; i++){
        var players = rounds[i-1].players.split(',');
        var groups = [];
        for(var j=0;j<players.length;j++)
        {
            if(players[j] != ""){
                var data ={
                    user: await Women.getNamefromId(parseInt(players[j])),
                    id: parseInt(players[j]),
                    boardid: j / 2,
                }
                groups.push(data);
            }
        }
        gamestatus.push({
            round: rounds[i-1].roundId,
            groups: groups
        })
    }
    for(var i=rounds.length+1;i<=5;i++){
        var groups = [];
        for(var j=0;j<32/Math.pow(2,i-1);j++){
            var data ={
                index: j/2,
            }
            groups.push(data);
        }
        gamestatus.push({
            round: i,
            groups: groups
        })
    }
    return gamestatus;
}

async function endCurrentRound(){
    var gameId = await Game.getCurrentGameId();
    var round = await Round.getCurrentRound(gameId);
    await setWinners(round);
    InitRound(gameId,round.roundId);
}

async function setWinners(round){
    var players = round.players.split(",");
    var winners = [];
    for(var i=0;i<players.length;i+=2){
        var vote1 = await Women.getVotefromId(parseInt(players[i]));
        var vote2 = await Women.getVotefromId(parseInt(players[i+1]));
        if(vote1 >= vote2) {
            await Women.setSurvival(parseInt(players[i+1]));
            winners.push(parseInt(players[i]));
        }
    }
    var result = "";
    for(var i=0;i<winners.length;i++){
        result += winners[i].toString();
        if(i != winners.length - 1) result += ',';
    }
    await Round.setRoundResult(round.gameId, round.roundId, result);
}

async function InitRound(gameId,roundId){
    await Women.clearAllVote();
    if(roundId != 5)
    {
        await Round.AddNewRound(gameId,roundId);
    }
    else
    {
        InitGamestatus();
    }
}
//module.exports = { InitGamestatus, getGameStatus, getCurrentRound, syncTime };
module.exports = { InitGamestatus, getGameStatus, getCurrentRound, syncTime, endCurrentRound, setWinners, InitRound };