if(process.env.NODE_ENV !=="production" ){
    require('dotenv').config();
}


const express= require('express'); const app= express();
const expressLayouts = require('express-ejs-layouts');
const mongoose= require('mongoose');
const User= require('./models/users')


app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use('/', require('./routes/index'))



//database connection...

const mongoDB = 'mongodb://localhost:27017/newdatabase';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

const db= mongoose.connection;
db.on('error', error=>console.error(error));
db.once('open', ()=>console.log('connected to mongoose.'));

app.listen(process.env.PORT|| 3000, ()=>{
    console.log("hey there...")
})