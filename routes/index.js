const userRoutes = require("./user");
const teamRoutes = require("./team");
const taskRoutes = require("./task");
const feedRoutes = require("./feed");
const mainRoutes = require("./main");
const path = require("path");

const constructorMethod = (app) => {
  app.use("/", mainRoutes);
  app.use("/user", userRoutes);
  app.use("/", teamRoutes);
  app.use("/feed", feedRoutes);
  app.use("/task", taskRoutes);

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
