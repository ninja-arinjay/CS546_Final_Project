const userRoutes = require("./user");
const feedRoutes = require("./feed");
const path = require("path");

const constructorMethod = (app) => {
  app.use("/", userRoutes);
  app.use("/feed", feedRoutes);

  app.use("*", (req, res) => {
    res.redirect("/");
    //res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
