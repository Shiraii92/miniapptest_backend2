const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
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
    type: Number,
    required: true,
  },
  womenId: {
    type: Number,
    required: true,
  },
  win: {
    type: Number,
    required: true,
  }
});

betSchema.statics.addBet = async function(username, point, womenId) {
  try {
    const bet = {
      username: username,
      point: point,
      roundId: 1, // Setze die korrekte Rundennummer
      boardId: 1, // Setze die korrekte Board-ID
      womenId: womenId,
      win: 0
    };
    const newBet = await Bet.create(bet);
    return newBet;
  } catch (err) {
    console.error('Error inserting bet:', err);
    throw err;
  }
};

const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;
