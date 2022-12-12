const userRoutes = require("./user");
const path = require("path");

const constructorMethod = (app) => {
 app.use("/", userRoutes);
  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

module.exports = constructorMethod;
