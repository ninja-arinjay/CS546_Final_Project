const userRoutes = require("./user");
const teamRoutes = require("./team");
const taskRoutes = require("./task");
const feedRoutes = require("./feed");
const path = require("path");

const constructorMethod = (app) => {
  app.use("/", userRoutes);
  app.use("/", teamRoutes);
  app.use("/", taskRoutes);
  app.use("/feed", feedRoutes);

  app.use("*", (req, res) => {
    return res.status(404).render("error/error", {
      title: "Error",
      error: "PAGE NOT FOUND",
      status: 400,
      layout: "error",
    });
  });
};

module.exports = constructorMethod;
