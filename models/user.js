const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  point: {
    type: Number,
  },
  top_pick: {
    type: Number,
  },
  vote_data: {
    type: String,
  }
});

userSchema.statics.findByUsername = async function(name) {
  try {
    const user = await this.findOne({ username: name });
    return user;
  } catch (err) {
    console.error('Error finding user by username:', err);
    throw err;
  }
};

userSchema.statics.addUser = async function(data){
  try {
    const user ={
      username: data.username,
      point: 100,
      top_pick: 0,
      vote_data: ""
    };
    await User.create(user);
    return user;
  } catch (err) {
    console.error('Error insert user:', err);
    throw err;
  }
}
userSchema.statics.setTopPick = async function(name,womenId){
  try {
    const filter = { username: name };
    const updateDoc = {
      $set: {
        top_pick : womenId
      },
    };
    const user = await this.updateOne(filter, updateDoc);
    return user;
  } catch (err) {
    console.error('Error finding user by username:', err);
    throw err;
  }
}
userSchema.statics.addPoint = async function(name, womenId){
  try {
    const user = await this.findOne({ username: name });
    const personalData = user.vote_data.split(',');
    var resultdata = "";
    if(personalData[0] == "")
    {
      resultdata += womenId + ':' + 1 + ',';
    }
    else{
      var flag = true;
      for(var i=0;i<personalData.length-1;i++){
        const id = parseInt(personalData[i].split(':')[0]);
        var vote = parseInt(personalData[i].split(':')[1]);
        if( id == womenId ) {
          flag = false;
          vote += 1;
          resultdata += id + ':' + vote + ',';
        }
        else
          resultdata += id + ':' + vote + ',';
      }
      if(flag == true)
        resultdata += womenId + ':' + 1 + ',';
    }
    const filter = { username: name };
    const updateDoc = {
      $set: {
        point : user.point + 1,
        vote_data : resultdata
      },
    };
    await this.updateOne(filter, updateDoc);
    const returnUser = await this.findOne({ username: name });
    return returnUser;
  } catch (err) {
    console.error('Error finding user by username:', err);
    throw err;
  }
}
userSchema.statics.removeBet = async function(name, point){
  try {
    const user = await this.findOne({ username: name });
    const filter = { username: name };
    const updateDoc = {
      $set: {
        point : user.point - point,
      },
    };
    await this.updateOne(filter, updateDoc);
    const returnData = await this.findOne({ username: name });
    return returnData;
  } catch (err) {
    console.error('Error finding user by username:', err);
    throw err;
  }
}
const User = mongoose.model('User', userSchema);

module.exports = User;