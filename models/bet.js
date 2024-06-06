const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  betId:{
    type:Number,
  },
  username: {
    type: String,
    required: true,
  },
  point: {
    type: Number,
    required: true,
  },
  roundId: {
    type: Number,
    required: true,
  },
  boardId: {
    type:Number,
    required: true,
  },
  womenId: {
    type: Number,
    required: true,
  },
  win:{
    type:Number,
    required: true,
  }
});

betSchema.statics.addBet = async function(name,point,womenId) {
  try {
    const bet ={
      "username" : name,
      "point": point,
      "roundId": 0,
      "boardId": 0,
      "womenId": womenId,
      "win": 0
    };
    await Bet.create(bet);
    return bet;
  } catch (err) {
    console.error('Error insert user:', err);
    throw err;
  }
};

const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;