const express = require('express');
const router= express.Router();
const multer= require('multer'); // this multer variable will be used to call a function on it..
const path= require('path');
const fs= require('fs')
const Book = require('../models/book');
const uploadPath= path.join('public', Book.coverImageBasePath);
const Author = require('../models/author');
const imageMimeTypes= ['image/jpeg','image/jpg', 'image/png', 'image/gif']
const upload= multer({
    // destination where the file should be uploaded in our project.. and which we will want from the book model itself..
    dest:uploadPath,
    fileFilter: (req, file ,callback)=>{
        callback(null,imageMimeTypes.includes(file.mimetype))
    }
})

// All Books route
router.get('/', async(req, res)=>{
    // res.send("All book")
    let query= Book.find();
    if(req.query.title !=null && req.query.title!=''){
        query= query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore !=null && req.query.publishedBefore!=''){
        query=query.lte('publishDate', req.query.publishedBefore);
    }
    if(req.query.publishedAfter !=null && req.query.publishedAfter!=''){
        query=query.gte('publishDate', req.query.publishedAfter);
    }
   

    try {
        const books= await query.exec();
        res.render('books/index', {
            books:books,
            searchOptions: req.query  
        })
        

    } catch (error) {
      res.redirect('/')   
    }

   
})

// new book
router.get('/new', async(req, res)=>{
  renderNewPage(res, new Book())
})

// add book..
router.post('/', upload.single('cover'),  async (req, res)=>{
    
    //req.file ,this file will be added by multer to reference the file sent by frontend
    const fileName= req.file!=null? req.file.filename:null
    // console.log(fileName);
    
    const book= new Book({
        title: req.body.title,
        author: req.body.author, 
        publishDate: new Date(req.body.publishDate),
        pageCount:req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
        //we are not actually putting the cover image name inside of this book object yet and that's because
        // we first need to create the cover image file on our file system get the name from there and then save that into our book object.
        //for that we will use multer which allows us to work with multi-part forms which is what a file form is
        // for that form needs to change of muti type as -- ecntype= "multipart/form-data"
    })
    try {
        const newBook= await book.save()
        
        res.redirect('books');
    } catch (error) {
        if(book.coverImageName!=null){
            // console.log("here i am")
            removeBookCover(book.coverImageName);
        }
        console.log("error in creating");
        renderNewPage(res, book , true);
    }
})

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err=>{
        if(err) console.log(err);
        else console.log("file deleted successfully..")
    });
}

async function renderNewPage(res, book, hasError=false){
    try {
        const authors= await Author.find({});
        // console.log(authors);
        
        const locals={
            authors:authors,
            book:book
        }
        if(hasError) locals.errorMessage="error creating book"
         res.render('books/new', locals)
    } catch (err) {
     res.redirect('/books');   
    }
}

module.exports= router