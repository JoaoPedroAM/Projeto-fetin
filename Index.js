const express = require("express");
const exphb = require("express-handlebars");
const mysql = require("mysql");
const port = 3000
const app = express();
const path = __dirname;


app.engine("handlebars", exphb.engine());
app.set("view engine", "handlebars");
app.use(express.static(__dirname + '/public'));
app.use(
  express.urlencoded({
    extended: true
  }),
)
app.use(express.json())

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/cadastro", (req, res) => {
  res.render("cadastro");
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


