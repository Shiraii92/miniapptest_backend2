const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameId: {
    type: Number,
  },
  currentRoundId: {
    type: Number,
  },
  status: {
    type: Boolean,
  },
});

gameSchema.statics.addNewGame = async function() {
    try {
      const game ={
        "gameId" : (await Game.find({})).length,
        "currentRoundId": 1,
        "status": true,
      };
      await Game.create(game);
      return game.gameId;
    } catch (err) {
      console.error('Error add game:', err);
      throw err;
    }
};
gameSchema.statics.getCurrentGameId = async function() {
  try {
    const games = await Game.find({});
    for(var i=0;i<games.length;i++)
      if(games[i].status == true) return games[i].gameId;
  } catch (err) {
    console.error('Error add game:', err);
    throw err;
  }
}

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;