const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  gameId: {
    type: Number,
  },
  roundId: {
    type: Number,
  },
  players: {
    type: String,
  },
  result: {
    type: String,
  },
  endAt:{
    type:Number,
  }
});

roundSchema.statics.InitRound = async function(gameId) {
  try 
  {
    const round ={
      "gameId" : gameId,
      "roundId": 1,
      "players": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32",
      "result": "",
      "endAt": 600000
    };
    await Round.create(round);
    return round;
  } catch (err) {
    console.error('Error insert user:', err);
    throw err;
  }
};

roundSchema.statics.AddNewRound = async function(gameId,roundId){
  try 
  {
    const oldround = await Round.findOne({gameId : gameId, roundId: roundId});
    const round ={
      "gameId" : gameId,
      "roundId": oldround.roundId + 1,
      "players": oldround.result,
      "result": ""
    };
    await Round.create(round);
    return round;
  } catch (err) {
    console.error('Error insert user:', err);
    throw err;
  }
}

roundSchema.statics.getRoundsByGameId = async function(gameId) {
  var rounds = await Round.find({});
  var returnData = [];
  for(var i=0;i<rounds.length;i++)
    if(rounds[i].gameId == gameId)
      returnData.push(rounds[i]);
  return returnData;
}
roundSchema.statics.getCurrentRound = async function(gameId) {
  var rounds = await Round.find({});
  for(var i=0;i<rounds.length;i++)
    if(rounds[i].gameId == gameId && rounds[i].result == "")
      return rounds[i];
}

roundSchema.statics.syncCurrentRound = async function(gameId){
  var rounds = await Round.find({});
  var roundId = 0;
  var endAt = 0;
  for(var i=0;i<rounds.length;i++)
  {
    if(rounds[i].gameId == gameId && rounds[i].result == ""){
      roundId = rounds[i].roundId;
      endAt = rounds[i].endAt;
    }
  }
  const filter = { gameId: gameId, roundId: roundId }; 
  const updateDoc = {
    $set: {
      endAt : endAt - 500
    },
  };
  const round = await this.updateOne(filter, updateDoc);
  return round;
}
roundSchema.statics.setRoundResult = async function(gameId,roundId,result){
  try {
    const filter = { gameId: gameId, roundId: roundId };
    const updateDoc = {
      $set: {
        result : result
      },
    };
    const round = await this.updateOne(filter, updateDoc);
    return round;
  } catch (err) {
    console.error('Error finding user by username:', err);
    throw err;
  }
}


const Round = mongoose.model('Round', roundSchema);

module.exports = Round;