const mongoose= require('mongoose');
const path = require('path')

const coverImageBasePath='uploads/bookCovers' 

const bookSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{ 
        type:String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount:{
        type:Number,
        required:true
    },
    createdAt:{             //because we want one recently added thing in there..
        type:Date,
        required:true,
        default: Date.now
    },
    coverImageName:{       // we will add image on server only, in database we will just pass the name/string..
        type:String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,   //it refers to another object inside the collection
        required:true,
        ref:'Author'
    }
})
// we are using this to get a path for image to be shown on the index or main page of image..
// we arenot using arrow function here as we have to use "this", which cant be used with arrow function
bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName!=null){
      return path.join('/', coverImageBasePath, this.coverImageName)
    }
})



module.exports= mongoose.model('Book', bookSchema);
module.exports.coverImageBasePath=coverImageBasePath // because we don't wanna export it as default..