const mongoose = require('mongoose');

const VolcabSchema = new mongoose.Schema({
    creater:{
        type:mongoose.Schema.Types.ObjectId,
    },
    eng:{
        type:String,
        require:true,
    },
    vnese:{
        type:String,
        require:true,
    }
}, { timestamps: true });

const Friend = mongoose.model('friends', FriendSchema);

module.exports = Friend