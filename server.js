const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();


const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const postRoutes = require('./routes/post');


mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser : true,
        useCreateIndex : true,
        useUnifiedTopology : true
    })
    .then(()=> console.log("mongoDB connected"))
    .catch(err => console.log(err));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/user', userRoutes);
app.use('/profile', profileRoutes);
app.use('/post', postRoutes);


const port = process.env.PORT || 4000;

app.listen(port, ()=> console.log(`server running on port ${port}`));