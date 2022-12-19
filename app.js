const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");
const logger = require("./utils/logger");

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
      checkInputValue: function (input, value, flag, options) {
        var fnTrue = options.fn,
          fnFalse = options.inverse;
        input = input + "";
        if (typeof value == "string") {
          if (value == input) {
            return flag ? fnTrue() : fnFalse();
          } else {
            return flag ? fnFalse() : fnTrue();
          }
        } else if (Array.isArray(value)) {
          if (value.includes(input)) {
            return flag ? fnTrue() : fnFalse();
          } else {
            return flag ? fnFalse() : fnTrue();
          }
        }
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

app.listen(3000, function () {
  logger.info("Server Started");
});
