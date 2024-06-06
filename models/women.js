const mongoose = require('mongoose');

const womenSchema = new mongoose.Schema({
  womenId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
  },
  vote: {
    type: Number,
  },
  isSurvive:{
    type: Boolean,
  }
});

womenSchema.statics.addWoman = async function(name,id){
    try {
      const woman ={
        "womenId" : id,
        "name": name,
        "vote": 0,
        "isSurvive": true
      };
      await Women.create(woman);
      return woman;
    } catch (err) {
      console.error('Error insert user:', err);
      throw err;
    }
}

womenSchema.statics.addVote = async function(id){
    try{
      const women = await this.findOne({ womenId: id });
      const filter = { womenId: id };
      const updateDoc = {
        $set: {
          vote : women.vote + 1
        },
      };
      const woman = await this.updateOne(filter, updateDoc);
      return woman;
    } catch(err){
      console.error('Error insert user:', err);
      throw err;
    }
}

womenSchema.statics.getNamefromId = async function(id){
  try {
    const women = await this.findOne({ womenId: id });
    return women.name;
  } catch (err) {
    console.error('Error insert user:', err);
    throw err;
  }
}

womenSchema.statics.getVotefromId = async function(id){
  try {
    const women = await this.findOne({ womenId: id });
    return women.vote;
  } catch (err) {
    console.error('Error insert user:', err);
    throw err;
  }
}

womenSchema.statics.setSurvival = async function(id){
  try{
    const updateDoc = {
      $unset: {
        vote: 0 
      },
    };
    const result = await Women.updateMany({}, updateDoc);
    return result;
  } catch(err){
    console.error('Error insert user:', err);
    throw err;
  }
}

womenSchema.statics.clearAllVote = async function(){
  try{
    const filter = { womenId: id };
    const updateDoc = {
      $set: {
        isSurvive : false
      },
    };
    const woman = await this.updateOne(filter, updateDoc);
    return woman;
  } catch(err){
    console.error('Error insert user:', err);
    throw err;
  }
}

womenSchema.statics.getAllWomens = async function(){
  try{
    const womens = await this.find({});
    const returnData = [];
    for(var i=0;i<womens.length;i++){
      const data = {
        id: womens[i].womenId,
        name: womens[i].name,
      }
      returnData.push(data);
    }
    return returnData;
  } catch(err){
    console.error('Error insert user:', err);
    throw err;
  }
}

const Women = mongoose.model('Women', womenSchema);

module.exports = Women;