const express = require("express");
const exphb = require("express-handlebars");
const mysql = require("mysql");
const port = 3000
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require('./passport-config');
const flash = require("express-flash");
const session = require("express-session");
const path = __dirname;

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

app.engine("handlebars", exphb.engine());
app.set("view engine", "handlebars");
app.use(express.static(__dirname + '/public'));
app.use(
  express.urlencoded({
    extended: true
  }),
)
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const hashedPassword =await bcrypt.hash(req.body.password, 10)
    users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  console.log(users);
  
});

app.get("/login", (req, res) => {
  res.render("login");
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


