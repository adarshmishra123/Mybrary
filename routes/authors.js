const express= require('express');
const router= express.Router();
const Author= require('../models/author')

/// all authors
router.get('/', async (req, res)=>{

   let searchOptions= {};
   if(req.query.name !=null && req.query.name !==''){
       searchOptions.name= new RegExp(req.query.name, 'i')
   }

   
    try {
        const authors = await Author.find(searchOptions);
        res.render('authors/index',{ 
            authors:authors, 
            searchOptions: req.query
        })
    } catch (err) {
        res.redirect('/');
    }
   
    
})

// new authours..
router.get('/new', (req, res)=>{
    res.render("authors/new", {author: new Author()})     //this author variable will be sent to new.ejs file 
})

//creating authors..
router.post('/', async (req, res)=>{
    
    const author = new Author({
        name: req.body.name
    })

    try {
       const x= await author.save(()=>{
            res.redirect("authors");
        })
    } catch (error) {
        let locals={
                    author:author,
                    errorMessage: "some error occurred"
                }
                   res.render("authors/new", locals )
               }           
   
})


module.exports= router;