const mongoose = require('mongoose');
const Joi = require("joi")

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
        default:[],
    },
    note:{
        type:String,
    },
    type:{
        type:[String],
        default:[],
    },
    pageNumber:{
        type:Number
    },
    synonyms:{
        type:[String],
        default:[]
    },
    usesage:{
        type:String,
    },
    topic:{
        type:String,
    }    
}, { timestamps: true });

const volcabJoiSchema = Joi.object({
    // creater: Joi.string().required(),
    eng: Joi.string().required(),
    vnese: Joi.array().items(Joi.string()).required(),
    example: Joi.array().items(Joi.string()),
    note: Joi.string(),
    type: Joi.array().items(Joi.string()),
    pageNumber: Joi.number(),
    synonyms: Joi.array().items(Joi.string()),
    usesage:Joi.string(),
    topic:Joi.string()
});

VolcabSchema.methods.validateInput = function(data) {
    return volcabJoiSchema.validate(data);
};


module.exports = mongoose.model('volcabs', VolcabSchema);
