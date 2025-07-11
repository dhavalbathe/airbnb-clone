const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.get('/register', (req, res) => {
    const { name = "anonymus"} = req.query;
    req.session.name = name;
    req.flash("success", "user register successfully");
    res.redirect('/hello');
});

app.get('/hello', (req, res) => {
    console.log(req.flash("success"));
    res.locals.message = req.flash("success");
    res.render('user.ejs', {name : req.session.name} );
})

app.listen(3000);