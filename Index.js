const DB = require("./models/user");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const hbs = require("express-handlebars");
const express = require("express");
const bodyParser = require("body-parser");
const path = __dirname;
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");

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
var dadosUsuario;

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

var hbsContent = {
  userName: "",
  loggedin: false,
  driver: false,
  id: null,
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

app
  .route("/cadastro")
  .get((req, res) => {
    res.render("cadastro", hbsContent);
  })
  .post((req, res) => {
    DB.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      celNumber: req.body.celNumber,
      password: req.body.password,
      idEstudantil: req.body.idEstudantil,
      driver: req.body.driver ? true : false,
      cnh: req.body.cnh,
    })
      .then((user) => {
        req.session.user = user.dataValues;
        dadosUsuario = req.session.user;
        res.redirect("/home");
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/cadastro");
      });
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("login", hbsContent);
  })
  .post((req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    DB.User.findOne({ where: { email: email } }).then(function (user) {
      if (!user) {
        res.redirect("/login");
      } else if (!user.validPassword(password)) {
        res.redirect("/login");
      } else {
        req.session.user = user.dataValues;
        dadosUsuario = req.session.user;
        res.redirect("/home");
      }
    });
  });

app.get("/home", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    hbsContent.loggedin = true;
    hbsContent.driver = req.session.user.driver;
    hbsContent.userName = req.session.firstName;
    res.render("home", hbsContent);
  } else {
    res.redirect("/login");
  }
});
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    hbsContent.loggedin = false;
    hbsContent.driver = false;
    dadosUsuario = null;

    res.clearCookie("user_sid");
    console.log(JSON.stringify(hbsContent));
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

app
  .route("/create")
  .get((req, res) => {})
  .post((req, res) => {
    if (hbsContent.driver === true) {
      DB.Corrida.create({
        starterCity: req.body.starterCity,
        finalCity: req.body.finalCity,
        date: req.body.date,
        time: req.body.time,
        price: req.body.price,
        userIdCorrida: dadosUsuario.idUser,
      });
    }
    res.redirect("/home");
  });

app.use(function (req, res, next) {
  res.status(404).send("Pagina não encontrada");
});

app.listen(app.get("port"), () => console.log(`App rodando na porta ${port}`));
