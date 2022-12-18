const userRoutes = require("./user");
const teamRoutes = require("./team");
const path = require("path");

const constructorMethod = (app) => {
  app.use("/", userRoutes);
  app.use("/", teamRoutes);
  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

module.exports = constructorMethod;
