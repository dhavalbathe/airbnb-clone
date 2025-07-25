const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const Listing = require('./models/listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingsRoute = require('./routes/listings.js');
const reviewRoute = require('./routes/review.js');
const userRoute = require('./routes/user.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main().then(() => {
    console.log("MongoDB Connected Successfully");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookies: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get('/', (req, res) => {
    res.send("this is main route");
});

//listings route
app.use('/listings', listingsRoute);

//review route
app.use('/listings/:id/reviews', reviewRoute);

//user authentication and autherization route
app.use('/', userRoute);

// error handling middleware
// app.all('*', (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found" ));
// });

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something wents wrong" } = err;
    res.status(statusCode).send(message);
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});