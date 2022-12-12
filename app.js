const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    helpers: {
      section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },
    },
  })
);
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/login", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
});

app.use("/register", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
});

configRoutes(app);

app.listen(3000);
