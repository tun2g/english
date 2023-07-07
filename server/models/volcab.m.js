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
        type:[String],
        require:true,
    },
    example:{
        type:[String],
    },
    note:{
        type:String,
    },
    type:{
        type:String,
    },
    pageNumber:{
        type:Number
    },
    synonyms:{
        type:[String]
    }    
}, { timestamps: true });

module.exports = mongoose.model('volcabs', VolcabSchema);