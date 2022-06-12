if(process.env.NODE_ENV !=="production" ){
    require('dotenv').config();
}


const express= require('express'); const app= express();
const expressLayouts = require('express-ejs-layouts');
const mongoose= require('mongoose');
const User= require('./models/users')
const bodyParser= require('body-parser');


app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({limit: '10mb', extended: false}));
app.use(express.json());
app.use('/', require('./routes/index'))
app.use('/authors', require('./routes/authors'))
app.use('/books', require('./routes/books'))
// app.use('/authors', require('./routes/authors'))




//database connection...

const mongoDB = 'mongodb://localhost:27017/newdatabase';
// const mongoDB = 'mongodb://library-adarsh.herokuapp.com://databaseconnection12345:Drive@12345@cluster0.t6s4e.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

const db= mongoose.connection;
db.on('error', error=>console.error(error));
db.once('open', ()=>console.log('connected to mongoose.'));

console.log("adarsh is learning many new things..")

app.listen(process.env.PORT|| 4000, ()=>{
    console.log("hey there...")
})