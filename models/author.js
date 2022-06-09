const mongoose = require('mongoose');

const authorSchema= new mongoose.Schema({
    name:{type:String, required:true}
    // password:{type:String, required:true}
})

const model= mongoose.model('Author', authorSchema)

module.exports= model