const express = require("express");
const data = require("../data");
const userData = data.users;
const teamData = data.teams;
const feedData = data.feed;
const router = express.Router();
const path = require("path");
const helpers = require("./../helpers/userHelper");
const aes256 = require("aes256");
const config = require("config");
const { Console } = require("console");
const { title } = require("process");
const xss = require("xss");
const logger = require("../utils/logger");

router.route("/").get(async (req, res) => {
  if (req.session.user) {
    let userCount = await userData.getAllUsers();
    userCount = userCount.length;
    let userRow = await userData.getUserById(
      aes256.decrypt(config.get("aes_key"), req.session.user.id)
    );
    let allTeams = await teamData.getAllTeams();
    let otherTeams = allTeams.length;
    allTeams = await teamData.getAllUserTeams(userRow.teamsJoined);
    let myTeams = allTeams.length;
    let successMessage = req.session.success;
    req.session.success = "";
    return res.status(200).render("dashboard/index", {
      title: "Dashboard",
      page: "Dashboard",
      activeClass: "dashboard-active",
      teams: allTeams,
      userData: aes256.decrypt(config.get("aes_key"), req.session.user.id),
      success: successMessage,
      userCount: userCount,
      myTeams: myTeams,
      teamCount: otherTeams,
    });
  } else {
    return res.render("static/static", {
      title: "Team Up",
      layout: "../static/static",
    });
  }
});

router
  .route("/register")
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/");
    } else {
      return res.status(200).render("user/register", {
        title: "Register",
        layout: "auth",
      });
    }
  })
  .post(async (req, res) => {
    try {
      const errorObject = {
        status: 400,
      };
      if (typeof req.body !== "object") {
        errorObject.error = "Invalid Data Posted.";
        throw errorObject;
      }
      let result = req.body;
      result.email = xss(result.email);
      result.password = xss(result.password);
      result.firstName = xss(result.firstName);
      result.lastName = xss(result.lastName);
      result.age = xss(result.age);
      result.bio = xss(result.bio);
      result.location = xss(result.location);
      let objKeys = [
        "email",
        "password",
        "firstName",
        "lastName",
        "age",
        "bio",
        "location",
      ];
      objKeys.forEach((element) => {
        helpers.checkInput(
          element,
          result[element],
          element + " of the user",
          true
        );
        if (element === "age") {
          result[element] = parseInt(result[element]);
        }
      });
      //console.log("working");
      logger.info("User Registered");
      await userData.createUser(result);
      res.redirect("/login");
    } catch (e) {
      //console.log(e);
      if (
        typeof e === "object" &&
        e !== null &&
        !Array.isArray(e) &&
        "status" in e &&
        "error" in e
      ) {
        return res.status(e.status).render("user/register", {
          title: "Register",
          error: e.error,
          layout: "auth",
        });
      } else {
        return res.status(400).render("user/register", {
          title: "Register",
          error: e.error,
          layout: "auth",
        });
      }
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/");
    } else {
      return res.status(200).render("user/login", {
        title: "Login",
        layout: "auth",
      });
    }
  })
  .post(async (req, res) => {
    try {
      const errorObject = {
        status: 400,
      };
      if (typeof req.body !== "object") {
        errorObject.error = "Invalid Data Posted.";
        throw errorObject;
      }
      let result = req.body;
      let objKeys = ["email", "password"];
      objKeys.forEach((element) => {
        helpers.checkInput(
          element,
          result[element],
          element + " of the user",
          true
        );
      });
      let userRow = await userData.checkUser(req.body.email, req.body.password);
      req.session.user = {
        email: aes256.encrypt(
          config.get("aes_key"),
          req.body.email.toLowerCase()
        ),
        id: aes256.encrypt(config.get("aes_key"), userRow.id),
      };
      logger.info("User Logged In");
      return res.redirect("/");
    } catch (e) {
      if (
        typeof e === "object" &&
        e !== null &&
        !Array.isArray(e) &&
        "status" in e &&
        "error" in e
      ) {
        return res.status(e.status).render("user/login", {
          title: "Login",
          error: e.error,
          layout: "auth",
        });
      } else {
        return res.status(400).render("user/login", {
          title: "Login",
          error: e,
          layout: "auth",
        });
      }
    }
  });

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
