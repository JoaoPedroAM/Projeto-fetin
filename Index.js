const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const hbs = require("express-handlebars");
const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/User");
const path = __dirname;

const app = express();
const port = 4000;

app.set("port", port);
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    key: "user_sid",
    secret: "somesecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

app.use(express.static("public"));
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
  })
);

app.set("view engine", "hbs");

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

let hbsContent = {
  userName: "",
  loggedin: false,
  title: "You are not logged in today",
  body: "Hello world",
};

app.use(express.static(__dirname + "/public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

let sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookie.user_sid) {
    res.redirect("/home");
  } else {
    next();
  }
};

app.get("/", sessionChecker, (req, res) => {
  res.redirect("/login");
});

app.route("/cadastro")
  .get((req, res) => {
    res.render("cadastro", hbsContent);
  })
  .post((req, res) => {
    User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      celNumber: req.body.celNumber,
      password: req.body.password,
      idEstudantil: req.body.idEstudantil,
      cnh: req.body.cnh,
    })
      .then((user) => {
        req.session.user = user.dataValues;
        res.redirect("/home");
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/cadastro");
      });
  });

app.route("/login").get((req, res) => {
    res.render("login", hbsContent);
  })
  .post((req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then(function (user) {
      if (!user) {
        res.redirect("/login");
      } else if (!user.validPassword(password)) {
        res.redirect("/login");
      } else {
        req.session.user = user.dataValues;
        res.redirect("/home");
      }
    });
  });

app.get("/home", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    hbsContent.loggedin = true;
    hbsContent.userName = req.session.firstName;
    hbsContent.title = "Tá logado parça";
    res.render("home", hbsContent);
  } else {
    res.redirect("/login");
  }
});
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    hbsContent.loggedin = false;
    hbsContent.title = "Tá deslogou irmao";
    res.clearCookie("user_sid");
    console.log(JSON.stringify(hbsContent));
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});



app.use(function (req, res, next) {
  res.status(404).send("Pagina não encontrada");
});

app.listen(app.get("port"), () => console.log(`App rodando na porta ${port}`));
